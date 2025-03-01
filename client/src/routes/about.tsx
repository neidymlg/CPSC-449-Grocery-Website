import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <section className="text-center mb-10">
        <h2 className="text-4xl font-extrabold">About</h2>
      </section>
      <section className="px-3">
        <p className="text-large text-gray-700">
          Affordable Groceries seeks to help you find the most affordable items!
          By listing the cheapest items from different stores, you can save
          money on the bottom line!
        </p>
      </section>
    </div>
  );
}
