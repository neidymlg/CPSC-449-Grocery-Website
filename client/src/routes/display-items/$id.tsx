import { createFileRoute, useParams } from "@tanstack/react-router";

// export const Route = createFileRoute("/display-items/$id")({
//   component: DisplayItemComponent,
// });

export const Route = createFileRoute("/display-items/$id")({
    component: RouteComponent,
  });
function RouteComponent() {
    const {id} = useParams({ from: "/display-items/$id" });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">Product Details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}