import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/create-account")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-sm mx-auto">
      <form>
        <div className="mb-5">
          <h1 className="text-4xl text-center mb-5 text-gray-900">
            Create an Account
          </h1>

          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-7 py-3 text-center mb-5"
        >
          Create Account
        </button>
      </form>
      <Link to="/login" className="font-medium text-blue-600 hover:underline">
        Already have an account? Log in
      </Link>
    </div>
  );
}
