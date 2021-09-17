import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      genres
      id
      author
    }
  }
`;

const Books = (props) => {
  const books = useQuery(ALL_BOOKS);
  const [filter, setFilter] = useState("allgenres");
  const [filteredbook, setfilteredbook] = useState([]);

  useEffect(() => {
    setfilteredbook(books);
  }, []);

  const filterbooks = (filter) => {
    if (filter === "allgenres") {
      setfilteredbook(books.data.allBooks);
    } else {
      setfilteredbook(
        books.data.allBooks.filter((b) => b.genres.includes(filter))
      );
    }
  };

  if (!props.show) {
    return null;
  }

  console.log(filteredbook);

  if (filterbooks.length === 0) {
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
      <button onClick={() => filterbooks("refactoring")}>refactoring</button>
      <button onClick={() => filterbooks("agile")}>agile</button>
      <button onClick={() => filterbooks("patterns")}>patterns</button>
      <button onClick={() => filterbooks("design")}>design</button>
      <button onClick={() => filterbooks("crime")}>crime</button>
      <button onClick={() => filterbooks("classic")}>classic</button>
      <button onClick={() => filterbooks("allgenres")}>all genres</button>
    </div>
  );
};

export default Books;
