import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import axios from "axios";

export const Route = createFileRoute("/findproduct")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<{ id: number, name: string }[]>([]);
  const navigate = useNavigate();

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

    const fetchLatLong = async () => {
      alert("Please provide your current location to find Grocery stores near you.")
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log("Latitude:", latitude, "Longitude:", longitude);
            alert(`Your location: Latitude ${latitude}, Longitude ${longitude}`);
          },
          (error) => {
            console.error("Error getting location:", error.message);
            alert("Unable to retrieve your location.");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by your browser.");
      }
    };

    fetchProducts();
    fetchLatLong();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const exProduct = products.find(
          (product) => product.name.toLowerCase() === searchTerm
        );
  
        if (exProduct) {
          console.log("Product already exists:", exProduct);
          navigate({
            to: "/display-item",
            params: { id: exProduct.id, name: exProduct.name}, 
          });
        } else {
          const response = await axios.post("/api/products", {
            name: searchTerm.toLowerCase(),
          });
          console.log("Added product:", response.data);
          setProducts([...products, response.data]);
          setSearchTerm("");
          navigate({
            to: "/display-item",
            params: { id: response.data.id, name: response.data.name },
          });
        }
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