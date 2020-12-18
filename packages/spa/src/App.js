import React from "react";

import { allBooks } from "@mr/utils";

function App() {
  return (
    <div>
      <h1>List of Books</h1>
      <ul>
        {allBooks().map(function renderBook(book) {
          return (
            <li key={book.id}>
              {book.title} from {book.author} about {book.tag || ""}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
