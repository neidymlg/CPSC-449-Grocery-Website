import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Affordable Groceries</title>
      </head>
      <body className="bg-gray-100 text-gray-800 font-sans antialiased">
        <div className="min-h-screen flex flex-col">
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
            <section className="text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                Welcome to Your Online Grocery Store
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Get fresh produce, pantry staples, and more delivered right to
                your door.
              </p>
              <Link
                to="/search"
                search={{ q: "" }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
              >
                Start Shopping Now
              </Link>
            </section>
          </main>

          <footer className="bg-gray-200 text-gray-600 py-6 border-t border-gray-300">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} Affordable Groceries</p>
            </div>
          </footer>
        </div>
        <Outlet /> {/* Start rendering router matches */}
      </body>
    </html>
  );
}
