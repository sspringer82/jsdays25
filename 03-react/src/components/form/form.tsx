import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBook, fetchBook, updateBook } from "@/api/books";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, BookSchema } from "./book.schema";
import { Book as BookType } from "@/types/Book";

type Props = {
  id?: string;
};

const Form: React.FC<Props> = ({ id }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Book>({
    resolver: zodResolver(BookSchema),
  });
  const navigate = useNavigate();

  const {
    data: book,
    isLoading,
    error,
  } = useQuery<Book>({
    queryKey: ["book", id],
    queryFn: () => fetchBook(id!),
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Book) => {
      if (data.id) {
        return updateBook(data.id, data as unknown as BookType);
      } else {
        return createBook(data as unknown as BookType);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "book", id] });
      navigate({ to: "/form" });
    },
  });

  useEffect(() => {
    if (book) {
      reset(book);
    }
  }, [book, reset]);

  const onSubmit = (data: Book) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading book data</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="isbn">ISBN</label>
        <Input
          id="isbn"
          className={errors.isbn ? "border-red-500" : ""}
          {...register("isbn")}
        />
        {errors.isbn && (
          <span className="text-red-500">{errors.isbn.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          className={errors.title ? "border-red-500" : ""}
          {...register("title")}
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <Input
          id="author"
          className={errors.author ? "border-red-500" : ""}
          {...register("author")}
        />
        {errors.author && (
          <span className="text-red-500">{errors.author.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="publishedYear">Published Year</label>
        <Input
          id="publishedYear"
          type="number"
          className={errors.publishedYear ? "border-red-500" : ""}
          {...register("publishedYear")}
        />
        {errors.publishedYear && (
          <span className="text-red-500">{errors.publishedYear.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="genre">Genre</label>
        <Input
          id="genre"
          className={errors.genre ? "border-red-500" : ""}
          {...register("genre")}
        />
        {errors.genre && (
          <span className="text-red-500">{errors.genre.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="pages">Pages</label>
        <Input
          id="pages"
          type="number"
          className={errors.pages ? "border-red-500" : ""}
          {...register("pages")}
        />
        {errors.pages && (
          <span className="text-red-500">{errors.pages.message}</span>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default Form;
