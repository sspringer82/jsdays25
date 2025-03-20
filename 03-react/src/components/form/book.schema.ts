import { z } from 'zod';

export const BookSchema = z.object({
  id: z.string().optional(),
  isbn: z.string().nonempty(),
  title: z.string().nonempty(),
  author: z.string().nonempty(),
  publishedYear: z.coerce.number(),
  genre: z.string().nonempty(),
  pages: z.coerce.number().min(1),
});

export type Book = z.infer<typeof BookSchema>;