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
      <section className="px-10">
        <p className="text-xl text-gray-700 mb-8">
        As a passionate team of California State University, Fullerton students,
        our mission here at Affordable Groceries is to provide you with the best
        deals and ensure you get the most value for your money.
        </p>
        <p className="text-xl text-gray-700">
          Affordable Groceries seeks to help you find the most affordable items,
          by listing the cheapest items from different stores, you can save
          money on the bottom line! We aim to make sure that you can get the best
          foods at the best prices. Eating healthy without breaking the bank is
          what we strive for. We hope you enjoy your shopping experience with us!
        </p>
      </section>
    </div>
  );
}
