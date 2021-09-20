import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const Login = ({ setError, setToken, show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      console.log(result.data);
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data]);

  if (!show) {
    return null;
  }

  const submit = (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <label htmlFor="name">name</label>
        <input
          type="text"
          id="name"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <label htmlFor="password">password</label>
        <input
          type="text"
          id="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
