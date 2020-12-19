import React from "react";

import { allBooks } from "@mr/utils";
import { BookCard } from "@mr/ui-web";

function App() {
  return (
    <div>
      <h1>List of Books</h1>
      <ul>
        {allBooks().map(function renderBook(book) {
          return (
            <li key={book.id}>
              <BookCard book={book} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
