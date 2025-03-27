import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/display-item")({
  component: RouteComponent,
});

function RouteComponent() {



  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">New Page</h1>
      <p>This is the new page displayed after the action in Find Product.</p>
    </div>
  );
}