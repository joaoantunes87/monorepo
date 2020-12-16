"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allBooks = exports.findBookById = void 0;
const books = [
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
function findBookById(id) {
    const book = books.find(({ id: bookId }) => id === bookId);
    if (book) {
        return book;
    }
    throw new Error("Not Found");
}
exports.findBookById = findBookById;
function allBooks() {
    return books;
}
exports.allBooks = allBooks;
//# sourceMappingURL=booksService.js.map