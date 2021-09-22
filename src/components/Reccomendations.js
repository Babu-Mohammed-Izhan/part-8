import React, { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { ALL_BOOKS } from "./Books";

const Reccomendations = (props) => {
  const [books, setbooks] = useState([]);
  const [getReccomendBooks, result] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    getReccomendBooks({ variables: { query: props.genre } });
  }, [props.genre]);

  useEffect(() => {
    setbooks(result.data);
  }, [result]);

  if (!props.show) {
    return null;
  }

  if (books.length === 0) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.length > 0 &&
            books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reccomendations;
