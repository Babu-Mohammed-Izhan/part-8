import React, { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const client = useApolloClient();

  const logout = () => {
    setToken("");
    localStorage.clear();
    client.resetStore();
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token === "" ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : null}
        {token === "" ? null : (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => logout()}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} setError={setError} />
    </div>
  );
};

export default App;
