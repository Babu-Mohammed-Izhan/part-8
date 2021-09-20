import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
    }
  }
`;

const ADD_AUTHORS = gql`
  mutation Mutation($author: String!, $date: Int!) {
    editAuthor(name: $author, setBornTo: $date) {
      name
      born
    }
  }
`;

const Authors = (props) => {
  const [author, setAuthor] = useState("Robert Martin");
  const [date, setDate] = useState(0);
  const authors = useQuery(ALL_AUTHORS);

  const [updatedauthor] = useMutation(ADD_AUTHORS, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }
  console.log(authors);
  if (authors.loading) {
    return <div>loading...</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    console.log(author);
    console.log(date);
    updatedauthor({ variables: { author, date } });
  };

  const handleAuthor = (event) => {
    event.preventDefault();
    console.log(event);
    setAuthor(event.target.value);
  };
  const handleDate = (event) => {
    event.preventDefault();
    console.log(event);
    setDate(event.target.value);
  };
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token === "" ? null : (
        <>
          <h2>Set birthyear</h2>
          <form onSubmit={handleSubmit}>
            <select value={author} onChange={handleAuthor}>
              {authors.data.allAuthors.map((a) => (
                <option value={a.name} key={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <label htmlFor="born">born</label>
            <input type="number" id="born" onChange={handleDate} />
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
