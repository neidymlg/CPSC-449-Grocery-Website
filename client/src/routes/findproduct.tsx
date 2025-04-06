import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export const Route = createFileRoute("/findproduct")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<{ id: number, name: string }[]>([]);
  const latitudeRef = useRef<string | null>(null); 
  const longitudeRef = useRef<string | null>(null);
  const LocationRef = useRef(false); 
  const navigate = useNavigate();

useEffect(() => {
  const initialize = async () => {
    // Fetch location and products
    await fetchInitialData();
    LocationRef.current = true; // Mark initialization as complete
  };

  const fetchInitialData = async () => {
  
    // Fetch products
    try {
      const response = await axios.get("/api/products");
      console.log("Fetched products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  
    // Fetch location
    if (!latitudeRef.current || !longitudeRef.current) {
      const storedLatitude = sessionStorage.getItem("latitude");
      const storedLongitude = sessionStorage.getItem("longitude");
  
      if (storedLatitude && storedLongitude) {
        latitudeRef.current = storedLatitude;
        longitudeRef.current = storedLongitude;
        console.log("Using stored location:", storedLatitude, storedLongitude);
      } else {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
              reject(new Error("Geolocation is not supported by this browser."));
            }
          });
  
          const lat = position.coords.latitude.toString();
          const lon = position.coords.longitude.toString();
  
          sessionStorage.setItem("latitude", lat);
          sessionStorage.setItem("longitude", lon);
  
          latitudeRef.current = lat;
          longitudeRef.current = lon;
  
          console.log("New location fetched:", lat, lon);
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("Unable to retrieve your location.");
        }
      }
    }

  };
  
    initialize();
  }, []);
  
  const handleAddProduct = async () => {
    if (!LocationRef.current) {
      return;
    }
  
    if (searchTerm.trim() !== "") {
      try {
        const exProduct = products.find(
          (product) => product.name.toLowerCase() === searchTerm
        );
  
        if (exProduct) {
          console.log("Product already exists:", exProduct);
          navigate({
            to: "/display-items/$id",
            params: { id: exProduct.id.toString() },
          });
        } else {
          const response = await axios.post("/api/products", {
            name: searchTerm.toLowerCase(),
          });
          console.log("Added product:", response.data);
          setProducts([...products, response.data]);
          setSearchTerm("");
          navigate({
            to: `/display-items/${response.data.id}`
          });
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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