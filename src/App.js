import React, { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient, useSubscription, gql } from "@apollo/client";
import Reccomendations from "./components/Reccomendations";
import { ALL_BOOKS } from "./components/Books";

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      genres
      id
      author
    }
  }
`;

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

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
      set.map((b) => b.id).includes(object.id);
    };

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData);
      window.alert("New book has been added");
      const addedBook = subscriptionData.data.bookAdded;
      updateCacheWith(addedBook);
    },
  });

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
            <button onClick={() => setPage("reccomend")}>recommend</button>
            <button onClick={() => logout()}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} setError={setError} />

      <Reccomendations show={page === "reccomend"} genre={"crime"} />
    </div>
  );
};

export default App;
