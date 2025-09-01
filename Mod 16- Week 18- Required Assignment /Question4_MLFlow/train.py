import pandas as pd
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.sklearn
from mlflow.models import infer_signature

# 1) Data
iris = load_iris(as_frame=True)
X = iris.data[["sepal length (cm)", "sepal width (cm)", "petal length (cm)", "petal width (cm)"]]
y = iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=7)

# 2) Train
clf = LogisticRegression(max_iter=200).fit(X_train, y_train)

# 3) Signature (defines input/output schema)
preds = clf.predict(X_test)
signature = infer_signature(X_test, preds)

# 4) Log to MLflow (saves model + signature as artifacts)
with mlflow.start_run() as run:
    mlflow.sklearn.log_model(
        sk_model=clf,
        artifact_path="model",        # model lives under .../artifacts/model
        signature=signature,
        input_example=X_test.head(2)
    )
    print("RUN_ID:", run.info.run_id)  # <-- copy this (no < >)
