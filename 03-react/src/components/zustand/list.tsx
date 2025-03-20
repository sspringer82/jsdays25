import { useBookStore } from "@/routes/zustand";

const List: React.FC = () => {
  const books = useBookStore((state) => state.books);
  const {removeBook} = useBookStore();

  
  if (!books || books.length === 0) {
    return <div>No books found</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>ISBN</th>
          <th>Title</th>
          <th>Author</th>
          <th>Published Year</th>
          <th>Genre</th>
          <th>Pages</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.id}</td>
            <td>{book.isbn}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.publishedYear}</td>
            <td>{book.genre}</td>
            <td>{book.pages}</td>
            <td>
              <button type="button" onClick={() => removeBook(book.id)}>delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default List;