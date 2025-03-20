import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { deleteBook, fetchBooks } from "../../api/books";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ts-query/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: books } = useSuspenseQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const mutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

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
              <Button
                variant={"outline"}
                onClick={() => mutation.mutate(book.id)}
              >
                delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
