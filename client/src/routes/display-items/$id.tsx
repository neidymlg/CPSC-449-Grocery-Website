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
  let nearbyStores: number[] = [];

  useEffect(() => {

    const checkNearbyStores = async () => {    
      try{
        const response = await axios.get("/api/store/check", {
          params: { LONG: longitude, LAT: latitude },
        });
        return response.data;
      }
      catch (error) {
        console.log("Error fetching Stores", error);
      }
    };
  
    const checkItemsForCurrentDay = async (storeIDs: number[]) => {
      try {    
        const response = await axios.get("/api/item/check_current_day", {
          params: { StoreIDs: storeIDs.join(','), ProductID: productID },
        });
        return response.data;
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
        console.log(`Updated item with ID: ${itemId}, Response:`, response.data);
      } catch (error) {
        console.error(`Error updating item with ID: ${itemId}`, error);
        throw error;
      }
    };

    const checkEmptyStores = async (storeIDs: number[]) => {
      try {
        const response = await axios.get("/api/item/check_no_items", {
          params: { 
            StoreIDs: storeIDs.join(','), 
            ProductID: productID 
          },
        });
        return response.data.emptyStoreIDs; // Returns array of store IDs
      } catch (error) {
        console.error("Error checking empty stores:", error);
        throw error;
      }
    };

    const getLongLat = async (storeID: number) =>{
      try {
        const response = await axios.get(`/api/store/${storeID}`);
        return response;
      } catch (error) {
        console.error("Error with fetching long/lat:", error);
        throw error;
      }
    }

    const fetchStoresAndItems = async () => {
      nearbyStores = await checkNearbyStores();
      
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

        nearbyStores.push(newStoreId);

        // call API for finding items
        const itemName = "item 3";
        const itemPrice = 1;
        await addNewItem(newStoreId, itemName, itemPrice);

      }
      else{
       const outdatedItems = await checkItemsForCurrentDay(nearbyStores);
       const emptyItems = await checkEmptyStores(nearbyStores);
        
        if (outdatedItems.length > 0) {
            for (const item of outdatedItems) {
              //Call API and insert items using the LONG/LAT to find the Stores
              // const coors = await getLongLat(item.Store_ID);
              // const LONG = coors.data.longitude;
              // const LAT = coors.data.latitude;

              const itemPrice = 5;
              await updateItem(item.ID, item.Store_ID, itemPrice);
            }
        }

        if(emptyItems.length > 0){
          for (const stores of emptyItems){
            //Call API and insert items using the LONG/LAT to find the Stores
            // const coors = await getLongLat(stores.ID);
            // const LONG = coors.data.longitude;
            // const LAT = coors.data.latitude;
            
            const itemName = "item z";
            const itemPrice = 1;
            await addNewItem(stores, itemName, itemPrice);
          }
        }
      }
    };

    const displayItems = async () => {
      for (const store of nearbyStores) {
        alert(`Stores : ${store}`);
        try{
          const storeName = await axios.get("/api/store/getname", {
            params: { StoreId: store },
          });
          alert(`Store Name: ${storeName}`);

          const display = await axios.get("/api/item/display", {
            params: { StoreID: store, ProductID: productID }
          });
          alert(`Items Name: ${display.data.Name} Items Price: ${display.data.Price}`);
        }
        catch (error) {
          console.log("Error fetching Stores/Items", error);
        }
      }
    };

    fetchStoresAndItems();
    // displayItems();
  }, [latitude, longitude, productID]);

  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">Product Details</h1>
      <p>Product ID: {productID}</p>
    </div>
  );
}