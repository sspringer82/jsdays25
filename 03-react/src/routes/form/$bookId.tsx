import Form from '@/components/form/form';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/form/$bookId')({
  component: RouteComponent,
})

function RouteComponent() {
  const bookId = Route.useParams().bookId;
  return <Form id={bookId} />
}
