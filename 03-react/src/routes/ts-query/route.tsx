import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const Route = createFileRoute("/ts-query")({
  component: RouteComponent,
});
const queryClient = new QueryClient();
function RouteComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Outlet />
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  );
}
