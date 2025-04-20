import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import axios from "axios";

export const Route = createFileRoute("/findproduct")({
  component: RouteComponent,
});

function RouteComponent() {
  //for adding in new products, a user can type in items such as "milk" or "eggs"
  const [searchTerm, setSearchTerm] = useState(""); 
  // For storing products fetched from the backend
  const [products, setProducts] = useState<{ id: number, name: string }[]>([]); 
  const navigate = useNavigate(); //for navigating to next page

useEffect(() => {
  const fetchInitialData = async () => {
  
    // Fetch products from db, and add to session Storage
    try {
      const response = await axios.get("/api/products");
      console.log("Fetched products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  fetchInitialData();
  }, []);
  
  const handleAddProduct = async () => {  
    // Check if the search term is not empty
    if (searchTerm.trim() !== "") {
      try {

        //check if product is already there in list of fetched items
        const exProduct = products.find(
          (product) => product.name.toLowerCase() === searchTerm
        );
  
        if (exProduct) {
          //product if found, uses the current product to move to the next page
          console.log("Product already exists:", exProduct);
          //navigates to next page
          navigate({
            to: `/display-items/${exProduct.id.toString()}`
          });
        } else {
          // adds product to the db
          const response = await axios.post("/api/products", {
            name: searchTerm.toLowerCase(),
          });       
          console.log("Added product:", response.data);
          //adds product into sessionStorage so datalist can see it
          setProducts([...products, response.data]);
          //clears search term
          setSearchTerm("");
          //navigates to next page
          navigate({
            to: `/display-items/${response.data.id}`
          });
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  //event to change searchTerm to the data in html (the user changes searchTerm)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div>
      <section className="text-center mb-10">
        <h2 className="text-4xl font-extrabold">Find Product</h2>
      </section>
      <section className="px-10">
        {/* User can replace searchItem by typing or clicking from datalist */}
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={handleSearchChange}
          list="product-list"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
        />
        {/*Gets all Products from DB and displays in a list that can be clicked*/}
        <datalist id="product-list">
          {products.map((product, index) => (
            <option key={index} value={product.name} />
          ))}
        </datalist>
        {/* When button is clicked, moves to next page */}
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