import Form from '@/components/form/form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/form/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Form />
}
