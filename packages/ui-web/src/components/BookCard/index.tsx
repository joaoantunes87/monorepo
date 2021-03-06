import React from 'react';

export default function BookCard({ book }: { book: any }) {
  return (
    <div>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <small>{book.tag}</small>
    </div>
  );
}
