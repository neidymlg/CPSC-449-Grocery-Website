import { createRoute, Link } from "@tanstack/react-router";
import { Route as layoutRoute } from "./__root";

const Home = () => {
  return (
    <section className="text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        Welcome to Your Online Grocery Store
      </h2>
      <p className="text-lg text-gray-700 mb-15">
        Get fresh produce, pantry staples, and more delivered right to your
        door.
      </p>
      <Link
        to="/login"
        search={{ q: "" }}
        className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-xl px-10 py-5 text-center me-2 mb-2 m-10"
      >
        Log In
      </Link>
    </section>
  );
};

export const Route = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Home,
});
