import React from 'react';
import { useBookStore } from '@/routes/zustand';

const Header: React.FC = () => {
  const books = useBookStore((state) => state.books);

  return (
    <header>
      <h1>Book List</h1>
      <p>Total Books: {books.length}</p>
    </header>
  );
};

export default Header;