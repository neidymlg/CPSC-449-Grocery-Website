import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

const Layout = () => (
  <div className="bg-gray-100 min-h-screen flex flex-col">
    <header className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          <Link
            to="/"
            className="hover:text-gray-700 transition-colors duration-200"
            activeProps={{
              className: "font-bold text-gray-900",
            }}
            activeOptions={{
              includeSearch: false,
            }}
          >
            Affordable Groceries 🛒
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/about"
                className="hover:text-gray-700 transition-colors duration-200"
                activeProps={{
                  className: "font-bold text-gray-900",
                }}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                search={{ q: "" }}
                className="hover:text-gray-700 transition-colors duration-200"
                activeProps={{
                  className: "font-bold text-gray-900",
                }}
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main className="flex-grow container mx-auto px-4 py-12">
      <Outlet />
    </main>
    <footer className="bg-gray-200 text-gray-600 py-6 border-t border-gray-300">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Affordable Groceries</p>
      </div>
    </footer>
  </div>
);

export const Route = createRootRoute({
  component: Layout,
});
