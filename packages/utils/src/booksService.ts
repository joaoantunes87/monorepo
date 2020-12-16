import { IBook } from "@mr/types";

const books: IBook[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Uncle Bob",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "Andy Hunt and Dave Thomas",
  },
];

export function findBookById(id: string): IBook {
  const book = books.find(({ id: bookId }) => id === bookId);

  if (book) {
    return book;
  }

  throw new Error("Not Found");
}

export function allBooks(): IBook[] {
  return books;
}
