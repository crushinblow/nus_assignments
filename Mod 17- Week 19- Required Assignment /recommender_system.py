"""
Recommender System — Q3 & Q4 
- Q3(a) Build user–item matrix
- Q3(b) Sparsity calculation
- Q3(c) User-based KNN recommendations (cosine, similarity-weighted)
- Q3(d) Cold-start handling:
    * New user with SOME ratings -> item-based CF (similar items, computed from ratings only)
    * COMPLETELY new user (no ratings) -> popularity baseline
- Q4 Evaluate Collaborative Filtering (User-KNN) vs Popularity Baseline (MSE/RMSE)

Run:
    python3 recommender_system.py
"""

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from math import sqrt
from typing import Optional, List


# =======================================
# 0) DATA LOADING 
# =======================================

def load_and_normalize_ratings(path: str = "ratings.csv") -> pd.DataFrame:
    """
    Loads ratings CSV and standardizes columns to: user_id, movie_id, rating.
    Works with MovieLens headers: userId, movieId, rating, timestamp.
    """
    df = pd.read_csv(path)

    # normalize headers
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'[^0-9a-z]+', '_', regex=True)
    )

    # map to canonical names
    if "userid" in df.columns:
        df = df.rename(columns={"userid": "user_id"})
    if "movieid" in df.columns:
        df = df.rename(columns={"movieid": "movie_id"})

    # verify required columns
    need = {"user_id", "movie_id", "rating"}
    if not need.issubset(df.columns):
        raise ValueError(f"ratings.csv must contain userId/user_id, movieId/movie_id, and rating. Found: {list(df.columns)}")

    # keep only required fields
    df = df[["user_id", "movie_id", "rating"]].copy()

    # coerce & clean
    df["user_id"]  = pd.to_numeric(df["user_id"], errors="coerce").astype("Int64")
    df["movie_id"] = pd.to_numeric(df["movie_id"], errors="coerce").astype("Int64")
    df["rating"]   = pd.to_numeric(df["rating"], errors="coerce")
    df = df.dropna(subset=["user_id", "movie_id", "rating"])
    df["user_id"]  = df["user_id"].astype(int)
    df["movie_id"] = df["movie_id"].astype(int)

    return df


# ==========================================
# Q3(a) BUILD USER–ITEM (UTILITY) MATRIX
# ==========================================

def build_user_item_matrix(ratings: pd.DataFrame) -> pd.DataFrame:
    """
    rows   = user_id
    cols   = movie_id
    values = mean rating
    NaN means 'unrated'
    """
    return ratings.pivot_table(
        index="user_id",
        columns="movie_id",
        values="rating",
        aggfunc="mean"
    )


# ==========================================
# Q3(b) SPARSITY CALCULATION
# ==========================================

def calc_sparsity(user_item_matrix: pd.DataFrame) -> float:
    """Sparsity = 1 - (non-empty cells / total possible cells)."""
    total = user_item_matrix.shape[0] * user_item_matrix.shape[1]
    non_null = user_item_matrix.count().sum()
    return 1.0 - (non_null / total)


# ==========================================================
# Similarity Matrices (USER-USER, ITEM-ITEM) for CF
# ==========================================================

def build_similarity_matrices(user_item_matrix: pd.DataFrame):
    """
    user_sim_df: user–user cosine similarity (rows/cols = user_id)
    item_sim_df: item–item cosine similarity (rows/cols = movie_id)
    Computed from ratings only (NaN filled with 0 for the math).
    """
    filled = user_item_matrix.fillna(0.0)

    user_sim = cosine_similarity(filled.values)
    user_sim_df = pd.DataFrame(user_sim, index=filled.index, columns=filled.index)

    item_sim = cosine_similarity(filled.T.values)
    item_sim_df = pd.DataFrame(item_sim, index=filled.columns, columns=filled.columns)

    return user_sim_df, item_sim_df


# ==========================================================
# Q3(c) USER-BASED KNN RECOMMENDATIONS (COSINE, WEIGHTED)
# ==========================================================

def recommend_movies_knn(
    user_item_matrix: pd.DataFrame,
    user_sim_df: pd.DataFrame,
    user_id: int,
    k: int = 5,
    top_n: int = 5,
    weighted: bool = True,
) -> pd.Series:
    """
    1) Find K nearest users to target (cosine similarity).
    2) Aggregate their ratings for movies target user hasn't rated:
       - similarity-weighted average (default) or simple mean.
    3) Return Top-N highest-scoring movies.
    """
    if user_id not in user_item_matrix.index:
        raise ValueError(f"user_id {user_id} not found in user_item_matrix.")

    sims = user_sim_df.loc[user_id].drop(index=user_id).sort_values(ascending=False)
    if sims.empty:
        return pd.Series(dtype=float)

    k_eff = min(k, len(sims))
    neighbours = sims.iloc[:k_eff]
    neigh_ratings = user_item_matrix.loc[neighbours.index]

    already_rated = user_item_matrix.loc[user_id].dropna().index
    candidate_ratings = neigh_ratings.drop(columns=already_rated, errors="ignore")
    if candidate_ratings.shape[1] == 0:
        return pd.Series(dtype=float)

    if weighted:
        w = neighbours.values.reshape(-1, 1)  # (k, 1)
        R = candidate_ratings.values          # (k, M), NaN where unrated
        mask = ~np.isnan(R)

        weighted_sum = np.nansum(R * w, axis=0)
        weight_total = np.nansum(mask * w, axis=0)

        with np.errstate(invalid="ignore", divide="ignore"):
            scores = weighted_sum / weight_total
    else:
        scores = np.nanmean(candidate_ratings.values, axis=0)

    return pd.Series(scores, index=candidate_ratings.columns).dropna().sort_values(ascending=False).head(top_n)


# ==========================================================
# Q3(d) COLD-START (ITEM-BASED + POPULARITY)
# ==========================================================

def item_based_similar_recs(item_sim_df: pd.DataFrame, seed_movies: List[int], top_n: int = 5) -> pd.Series:
    """New user with SOME ratings: recommend items similar to rated ones (from ratings-only item similarities)."""
    if not seed_movies:
        return pd.Series(dtype=float)

    scores = pd.Series(dtype=float)
    for m in seed_movies:
        if m in item_sim_df.index:
            sim_col = item_sim_df[m].drop(index=m, errors="ignore")
            scores = scores.add(sim_col, fill_value=0.0)

    return scores.sort_values(ascending=False).head(top_n)


def popularity_fallback(ratings: pd.DataFrame, top_n: int = 5) -> pd.Series:
    """
    COMPLETELY new user: recommend 'popular' items using a simple Bayesian-style score:
      score = (C*m + mean*count) / (C + count)
    """
    by_movie = ratings.groupby("movie_id")["rating"].agg(["mean", "count"])
    if len(by_movie) == 0:
        return pd.Series(dtype=float)
    C = by_movie["count"].median()
    m = ratings["rating"].mean()
    by_movie["score"] = (C * m + by_movie["mean"] * by_movie["count"]) / (C + by_movie["count"])
    return by_movie["score"].sort_values(ascending=False).head(top_n)


def recommend_for_new_user(
    ratings: pd.DataFrame,
    item_sim_df: pd.DataFrame,
    rated_movies: Optional[List[int]],
    top_n: int = 5
) -> pd.Series:
    """If SOME ratings → item-based; if NONE → popularity."""
    if rated_movies and len(rated_movies) > 0:
        return item_based_similar_recs(item_sim_df, rated_movies, top_n=top_n)
    else:
        return popularity_fallback(ratings, top_n=top_n)


# ======================================
# Q4) EVALUATION (MSE / RMSE)
# ======================================

def rmse(y_true, y_pred) -> float:
    return sqrt(mean_squared_error(y_true, y_pred))


def make_train_test(ratings: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    """Row-wise split of ratings into train/test."""
    train_df, test_df = train_test_split(ratings, test_size=test_size, random_state=random_state)
    return train_df.reset_index(drop=True), test_df.reset_index(drop=True)


# --- Train a user-KNN predictor on TRAIN only ---
def fit_user_knn_predictor(train_df: pd.DataFrame):
    uim_train = build_user_item_matrix(train_df)
    user_sim_df, _ = build_similarity_matrices(uim_train)
    return {"uim_train": uim_train, "user_sim_df": user_sim_df}


def predict_user_knn(model: dict, user_id: int, movie_id: int, k: int = 5, weighted: bool = True) -> Optional[float]:
    """Predict a single (user, movie) rating with user-based KNN on TRAIN-only data."""
    uim = model["uim_train"]
    sim = model["user_sim_df"]

    if user_id not in uim.index or movie_id not in uim.columns:
        return None  # unseen in train

    sims = sim.loc[user_id].drop(index=user_id).sort_values(ascending=False)
    if sims.empty:
        return None

    k_eff = min(k, len(sims))
    neighbours = sims.iloc[:k_eff]

    neigh_ratings = uim.loc[neighbours.index, movie_id]
    mask = ~neigh_ratings.isna()
    if mask.sum() == 0:
        return None

    if weighted:
        w = neighbours[mask].values
        r = neigh_ratings[mask].values
        if w.sum() == 0:
            return None
        return float((w * r).sum() / w.sum())
    else:
        return float(neigh_ratings[mask].mean())


def evaluate_predictor(test_df: pd.DataFrame, predict_fn, max_rows: Optional[int] = None, name: str = "model"):
    """
    Iterate over a (possibly sampled) test set and compute MSE / RMSE + coverage.
    Coverage = fraction of rows where the model produced a prediction.
    """
    rows = test_df if max_rows is None else test_df.sample(n=min(max_rows, len(test_df)), random_state=42)

    y_true, y_pred = [], []
    skipped = 0

    for _, row in rows.iterrows():
        u, i, r = int(row["user_id"]), int(row["movie_id"]), float(row["rating"])
        pred = predict_fn(u, i)
        if pred is None or np.isnan(pred):
            skipped += 1
            continue
        y_true.append(r)
        y_pred.append(pred)

    if len(y_true) == 0:
        print(f"[{name}] No predictions produced (likely too cold/sparse).")
        return None

    mse_val = mean_squared_error(y_true, y_pred)
    rmse_val = sqrt(mse_val)
    coverage = 1 - (skipped / len(rows))
    print(f"[{name}] N={len(y_true)} | Coverage={coverage:.2%} | MSE={mse_val:.4f} | RMSE={rmse_val:.4f}")
    return {"mse": mse_val, "rmse": rmse_val, "coverage": coverage, "n": len(y_true)}


# =========================
# MAIN: Q3 Demo + Q4 Eval
# =========================
if __name__ == "__main__":
    # --- Load ratings (MovieLens-friendly) ---
    ratings = load_and_normalize_ratings("ratings.csv")
    print("Loaded ratings columns:", list(ratings.columns))
    print(ratings.head())

    # Q3(a) Build user–item matrix
    user_item_matrix = build_user_item_matrix(ratings)
    print("\nUser–Item matrix shape:", user_item_matrix.shape)

    # Q3(b) Sparsity
    sparsity = calc_sparsity(user_item_matrix)
    print(f"Sparsity: {sparsity:.2%}  (higher = emptier matrix; typical for CF)")

    # Build similarities once for Q3(c) & Q3(d)
    user_sim_df, item_sim_df = build_similarity_matrices(user_item_matrix)

    # Q3(c) User-based KNN recs for an example existing user
    try:
        example_user = int(user_item_matrix.index[0])
        recs_user = recommend_movies_knn(
            user_item_matrix=user_item_matrix,
            user_sim_df=user_sim_df,
            user_id=example_user,
            k=5,
            top_n=5,
            weighted=True
        )
        print(f"\nQ3(c) KNN Recommendations for user {example_user}:")
        print(recs_user)
    except Exception as e:
        print("\nQ3(c) KNN Recommendations skipped:", e)

    # Q3(d) Cold-start handling
    # Case A: New user with SOME ratings (use first movie as a seed example)
    seed_movies = [int(user_item_matrix.columns[0])] if user_item_matrix.shape[1] > 0 else []
    recs_warm = recommend_for_new_user(
        ratings=ratings,
        item_sim_df=item_sim_df,
        rated_movies=seed_movies,
        top_n=5
    )
    print("\nQ3(d) New user WITH some ratings (item-based similar items):")
    print(recs_warm)

    # Case B: COMPLETELY NEW user (no ratings) -> popularity
    recs_cold = recommend_for_new_user(
        ratings=ratings,
        item_sim_df=item_sim_df,
        rated_movies=None,
        top_n=5
    )
    print("\nQ3(d) COMPLETELY NEW user (popularity fallback):")
    print(recs_cold)

    # ------------------
    # Q4) EVALUATION
    # ------------------
    train_df, test_df = make_train_test(ratings, test_size=0.2, random_state=42)
    print(f"\nSplit: train={len(train_df)} rows, test={len(test_df)} rows")

    MAX_EVAL_ROWS = 5000  # set to None for full test

    # Q4a: Collaborative Filtering (User-KNN)
    user_knn_model = fit_user_knn_predictor(train_df)

    def _predict_user_knn(u, i):
        return predict_user_knn(user_knn_model, user_id=u, movie_id=i, k=5, weighted=True)

    print("\nEvaluating Collaborative Filtering (User-KNN):")
    evaluate_predictor(test_df, _predict_user_knn, max_rows=MAX_EVAL_ROWS, name="User-KNN")

    # Q4a: Popularity Baseline (no content features needed)
    # Predict with the same Bayesian-style popularity score used earlier,
    # evaluated as a proxy rating for test rows.
    by_movie_train = train_df.groupby("movie_id")["rating"].agg(["mean", "count"])
    C = by_movie_train["count"].median() if len(by_movie_train) else 0
    m = train_df["rating"].mean() if len(train_df) else 0
    by_movie_train["score"] = (C * m + by_movie_train["mean"] * by_movie_train["count"]) / (C + by_movie_train["count"])
    movie_pop_score = by_movie_train["score"]  # Series: movie_id -> score

    def _predict_popularity(u, i):
        return float(movie_pop_score.loc[i]) if i in movie_pop_score.index else None

    print("\nEvaluating Popularity Baseline:")
    evaluate_predictor(test_df, _predict_popularity, max_rows=MAX_EVAL_ROWS, name="Popularity Baseline")