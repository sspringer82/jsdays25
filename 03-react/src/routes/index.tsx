import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </li>
        <li>
          <Link to="/books">Books</Link>
        </li>
        <li>
          <Link to="/ts-query">TS Query</Link>
        </li>
        <li>
          <Link to="/ts-table">TS Table</Link>
        </li>
        <li>
          <Link to="/form">Form</Link>
        </li>
        <li>
          <Link to="/zustand">Zustand</Link>
        </li>
      </ul>
    </div>
  );
}
