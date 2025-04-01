import { createFileRoute, useParams } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/display-items/$id")({
    component: RouteComponent,
  });

function RouteComponent() {
  const { id: productID } = useParams({ from: "/display-items/$id" });
  const [latitude, setLatitude] = useState(parseFloat(sessionStorage.getItem("latitude") || "0"));
  const [longitude, setLongitude] = useState(parseFloat(sessionStorage.getItem("longitude") || "0"));


  useEffect(() => {

    const checkNearbyStores = async () => {    
      try{
        const response = await axios.get("/api/store/check", {
          params: { LONG: longitude, LAT: latitude },
        });
        console.log("Checked for nearby stores", response.data)
        alert(`Checked for nearby stores ${response.data}`);
        return response.data;
      }
      catch (error) {
  
      }
    };
  
    const checkItemsForCurrentDay = async (storeID: number) => {
      try {
        const response = await axios.get("/api/item/check_current_day", {
          params: { StoreID: storeID, ProductID: productID },
        });
        console.log("Checked for items on same day", response.data)
        return response.data; // Returns an array of items that are not updated
      } catch (error) {
        console.error("Error checking items for the current day:", error);
        throw error;
      }
    };
  
    const addNewStore = async (longitude: number, latitude: number, name: string) => {
      try {
        const response = await axios.post("/api/store", {
          LONG: longitude,
          LAT: latitude,
          Name: name,
        });
        console.log("Successfully read data for Store ID: ", response.data.id);
        return response.data.id; // Returns the ID of the newly added store
      } catch (error) {
        console.error("Error adding new store:", error);
        throw error;
      }
    };
  
    const addNewItem = async (
      storeId: number,
      name: string,
      price: number
    ) => 
    {
      try {
        const response = await axios.post("/api/item", {
          StoreID: storeId,
          ProductID: productID,
          Name: name,
          Price: price,
        });
        console.log("Successfully read data for Item ID: ", response.data.id);
        return response.data.id; // Returns the ID of the newly added item
      } catch (error) {
        console.error("Error adding new item:", error);
        throw error;
      }
    };

    const updateItem = async (itemId: number, storeId: number, price: number) => {
      try {
        const response = await axios.put(`/api/item/${itemId}`, {
          StoreID: storeId,
          ProductID: productID, 
          Price: price,
        });
        console.log(`Updated item with ID: ${itemId}`);
        return response.data;
      } catch (error) {
        console.error(`Error updating item with ID: ${itemId}`, error);
        throw error;
      }
    };

    const checkItemEmpty = async (storeID : number) =>{
      try {
        const response = await axios.get("/api/item/check_no_items", {
          params: { StoreID: storeID, ProductID: productID },
        });
        console.log("Fetched items for store:", response.data);
        return response.data; // Returns an array of items
      } catch (error) {
        console.error("Error fetching items for store:", error);
        throw error;
      }
    }

    const fetchStoresAndItems = async () => {
      alert(`Long ${longitude}, Lat: ${latitude}`);
      const nearbyStores = await checkNearbyStores();

      // for new stores and items
      // else for 
      if (!nearbyStores || nearbyStores.length === 0) {
        // ADD API to this section !!!!!
        // Call API for finding stores Near latitude, longitude
        // these are fake values, change them to all store lat/long/name

        // (add a for loop to add all these stores/items)
        const storeLat = 33.7572;
        const storeLon = -117.9111;
        const storeName = "Store Name 6"
        const newStoreId = await addNewStore(storeLon, storeLat, storeName);

        // call API for finding items
        const itemName = "item 3";
        const itemPrice = 1;
        const newItemID = await addNewItem(newStoreId, itemName, itemPrice);
      }
      else{
        // Don't Add API just yet
        console.log("Nearby stores found:", nearbyStores);
        
        const outdatedItems = await checkItemsForCurrentDay(nearbyStores.ID);
        const emptyItems = await checkItemEmpty(nearbyStores.ID);
        if (outdatedItems.length > 0) {
            
            //Update Items Based on Store ID
            for (const item of outdatedItems) {
              //call API to get new Price
              const itemPrice = 2;
              await updateItem(item.ID, nearbyStores.ID, itemPrice);
            }
        }

        if(!emptyItems || emptyItems.length === 0){
          //call API and add Items
          const itemName = "new item";
          const itemPrice = 1;
          const newItemID = await addNewItem(nearbyStores.ID, itemName, itemPrice);
        }

      }
      alert('End');
    };

    fetchStoresAndItems();
  }, [latitude, longitude, productID]);

  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">Product Details</h1>
      <p>Product ID: {productID}</p>
    </div>
  );
}