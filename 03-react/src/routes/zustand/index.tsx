import { createFileRoute } from "@tanstack/react-router";
import { create } from "zustand";
import { Book } from "../../types/Book";
import { deleteBook, fetchBooks } from "@/api/books";
import List from "@/components/zustand/list";
import { useEffect } from "react";
import Header from "@/components/zustand/header";

export const Route = createFileRoute("/zustand/")({
  component: RouteComponent,
});

type BookStore = {
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  fetchBooks: () => Promise<void>;
};

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  removeBook: async (id) => {
    await deleteBook(id);
  },
  fetchBooks: async () => {
    const books = await fetchBooks();
    set({ books });
  },
}));

function RouteComponent() {
  const { fetchBooks } = useBookStore();
  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <>
      <Header />
      <hr />
      <List />
    </>
  );
}
