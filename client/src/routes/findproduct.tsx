import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import axios from "axios";

export const Route = createFileRoute("/findproduct")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    // Fetch products from the database
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        console.log("Fetched products:", response.data); // Debugging log
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.post("/api/products", { name: searchTerm.toLowerCase() });
        console.log("Added product:", response.data); // Debugging log
        setProducts([...products, response.data]);
        setSearchTerm("");
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  return (
    <div>
      <section className="text-center mb-10">
        <h2 className="text-4xl font-extrabold">Find Product</h2>
      </section>
      <section className="px-10">
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={handleSearchChange}
          list="product-list"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
        />
        <datalist id="product-list">
          {products.map((product, index) => (
            <option key={index} value={product.name} />
          ))}
        </datalist>
        <button
          onClick={handleAddProduct}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-7 py-3 text-center mb-5"
        >
          Find Product
        </button>
      </section>
    </div>
  );
}