import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

const Layout = () => (
  <div className="bg-white min-h-screen flex flex-col">
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
                className="hover:bg-gray-100 hover:text-gray-900 text-gray-700 border border-transparent hover:border-gray-300 transition-colors duration-200 px-7 py-4 rounded-md"
                activeProps={{
                  className:
                    "font-bold text-gray-900 border border-gray-300 bg-gray-100",
                }}
              >
                About
              </Link>
            </li>
            <li>
            <Link
                to="/findproduct"
                className="hover:bg-gray-100 hover:text-gray-900 text-gray-700 border border-transparent hover:border-gray-300 transition-colors duration-200 px-7 py-4 rounded-md"
                activeProps={{
                  className:
                    "font-bold text-gray-900 border border-gray-300 bg-gray-100",
                }}
              >
                Search Products
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main className="flex-grow container mx-auto px-4 py-12">
      <Outlet />
    </main>
    <footer className="bg-gray-100 text-gray-600 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Affordable Groceries</p>
      </div>
    </footer>
  </div>
);

export const Route = createRootRoute({
  component: Layout,
});
