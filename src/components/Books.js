import React, { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";

export const ALL_BOOKS = gql`
  query findfilteredbooks($genre: String){
    allBooks(genre=$genre}) {
      title
      published
      genres
      id
      author
    }
  }
`;

const Books = (props) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS);
  const [filter, setFilter] = useState(null);
  const [filteredbook, setfilteredbook] = useState([]);

  useEffect(() => {
    setfilteredbook(result);
  }, [result]);

  useEffect(() => {
    getBooks({ variables: { query: filter } });
  }, [filter]);

  if (!props.show) {
    return null;
  }

  console.log(filteredbook);

  if (filteredbook.length === 0) {
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
          {filteredbook.length > 0 &&
            filteredbook.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.published}</td>
              </tr>
            ))}
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
