import Counter from "./components/state/Counter";
import "./App.css";
import "./styles.css";
import GithubUsers from "./components/githubusers/GithubUsers";

export default function App() {
  return (
    <div className="container">
      <GithubUsers />
      {/* <Counter /> */}
    </div>
  );
}
