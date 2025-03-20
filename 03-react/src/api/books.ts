import ky from "ky";
import { Book } from "../types/Book";

// export async function fetchBooks(): Promise<Book[]> {
//   const response = await fetch("http://localhost:3001/books");
//   if (!response.ok) {
//     throw new Error("Something went wrong");
//   }
//   return response.json();
// }

export async function fetchBooks(): Promise<Book[]> {
  return ky.get<Book[]>("http://localhost:3001/books").json();
}

export async function fetchBook(id: string): Promise<Book> {
  return ky.get<Book>(`http://localhost:3001/books/${id}`).json();
}

export async function createBook(book: Book): Promise<Book> {
  return ky.post<Book>("http://localhost:3001/books", { json: book }).json();
}

export async function updateBook(id: string, book: Book): Promise<Book> {
  return ky
    .put<Book>(`http://localhost:3001/books/${id}`, { json: book })
    .json();
}

export async function deleteBook(id: string): Promise<void> {
  return ky.delete(`http://localhost:3001/books/${id}`).json();
}
