import { IBook } from "@mr/types";

const books: IBook[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Uncle Bob",
    tag: "Software",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "Andy Hunt and Dave Thomas",
    tag: "Software",
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
  console.log("Do we have books?");
  return books;
}
