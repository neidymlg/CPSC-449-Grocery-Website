import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/create-account")({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/register", formData);
      setResponseMessage(response.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorMessage =
            error.response.data.error ||
            error.response.data.message ||
            error.message; //Try to get a more descriptive error message
          console.error("Server Response:", error.response.data);
          setResponseMessage("Error creating account: " + errorMessage);
        } else if (error.request) {
          console.error("No response received:", error.request);
          setResponseMessage("Error creating account: No response from server");
        }
      } else {
        setResponseMessage("Error creating account " + error);
      }
      console.error(error);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit}>
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
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            value={formData.password}
            onChange={handleChange}
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
      {responseMessage && <p className="text-red-400">{responseMessage}</p>}
      <Link to="/login" className="font-medium text-blue-600 hover:underline">
        Already have an account? Log in
      </Link>
    </div>
  );
}
