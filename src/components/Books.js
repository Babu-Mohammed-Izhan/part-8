import React, { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";

export const ALL_BOOKS = gql`
  query findfilteredbooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      genres
      id
      author
    }
  }
`;

const Books = (props) => {
  const [getBooks, { loading, error, data }] = useLazyQuery(ALL_BOOKS);
  const [filter, setFilter] = useState("");
  const [filteredbook, setfilteredbook] = useState(null);

  useEffect(() => {
    setfilteredbook(data);
  }, [data]);

  useEffect(() => {
    console.log(filter);
    getBooks({ variables: { genre: filter } });
  }, [filter]);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }
  console.log("books", filteredbook);
  console.log(error);
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
          {/* {filteredbook.allBooks &&
            filteredbook.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.published}</td>
              </tr>
            ))} */}
        </tbody>
      </table>
      <button onClick={() => setFilter("refactoring")}>refactoring</button>
      <button onClick={() => setFilter("agile")}>agile</button>
      <button onClick={() => setFilter("patterns")}>patterns</button>
      <button onClick={() => setFilter("design")}>design</button>
      <button onClick={() => setFilter("crime")}>crime</button>
      <button onClick={() => setFilter("classic")}>classic</button>
      <button onClick={() => setFilter(null)}>all genres</button>
    </div>
  );
};

export default Books;
