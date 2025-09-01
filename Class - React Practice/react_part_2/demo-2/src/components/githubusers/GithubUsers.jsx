import { useState } from "react";
import "./GithubUsers.css";
export default function GithubUsers() {
  const [users, setUsers] = useState([]);
  async function fetchUsers() {
    try {
      const response = await fetch("https://api.github.com/users");
      const result = await response.json();
      console.log(result);
      setUsers(result);
    } catch (error) {}
  }
  fetchUsers();
  return (
    <div className="users">
      <h1>GitHub Users</h1>
      <ul>
        {users.map((user, index) => {
          const { id, avatar_url, login, html_url } = user;
          return (
            <li key={id}>
              <img src={avatar_url} alt={login} />
              <p> {login} </p>
              <a href={html_url} target="_blank" className="profile-btn">
                Profile
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
