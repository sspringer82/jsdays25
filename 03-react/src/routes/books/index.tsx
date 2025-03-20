import { createFileRoute } from "@tanstack/react-router";
import { fetchBooks } from "../../api/books";

export const Route = createFileRoute("/books/")({
  component: RouteComponent,
  loader: fetchBooks,
});

function RouteComponent() {
  const books = Route.useLoaderData();

  if (books.length === 0) {
    return <div>No books found</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>ISBN</th>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>Genre</th>
          <th>Pages</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
