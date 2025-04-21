import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";

const RouteComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send login request to the backend
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });

      // Handle successful login
      setResponseMessage("Login successful!");
      console.log("User logged in:", response.data);

      // Redirect to another page (e.g., profile) if needed
      navigate({
        to: "/findproduct",
      });
    } catch (error) {
      console.error("Error logging in:", error);

      // Handle login failure
      if (axios.isAxiosError(error) && error.response) {
        setResponseMessage(error.response.data.error || "Login failed.");
      } else {
        setResponseMessage("An unexpected error occurred.");
      }
    }
  };   
  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <h1 className="text-4xl text-center mb-5 text-gray-900"> Log in</h1>

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
                  {/*<div className="flex items-start mb-5">
           <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700"
            /> */}
          {/* </div>
          <label
            htmlFor="remember"
            className="ms-2 mb-2 text-sm font-medium text-gray-900"
          >
            Remember me
          </label>
        </div> */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-7 py-3 text-center mb-5"
        >
          Login
        </button>
      </form>
      <Link
        to="/create-account"
        className="font-medium text-blue-600 hover:underline"
      >
        Create an Account
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});
