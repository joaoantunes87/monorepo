export interface IBook {
  id: string;
  title: string;
  author: string;
  tag?: string;
}

export function bookToString(book: IBook): string {
  return `${book.title}`;
}
