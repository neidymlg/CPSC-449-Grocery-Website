import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export const Route = createFileRoute("/display-items/$id")({
    component: RouteComponent,
  });

function RouteComponent() {
  const { id: productID } = useParams({ from: "/display-items/$id" });
  const latitudeRef = useRef(parseFloat(sessionStorage.getItem("latitude") || "0"));
  const longitudeRef = useRef(parseFloat(sessionStorage.getItem("longitude") || "0"));
  const cachedDataRef = useRef<{
    storeName: string;
    items: { Name: string; Price: number; Store_ID: number; Product_ID: number; Item_ID: number; ID: number }[];
  }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    const cacheKey = `cachedData_${productID}`;

    const checkNearbyStores = async () => {    
      try{
        const response = await axios.get("/api/store/check", {
          params: { LONG: longitudeRef.current, LAT: latitudeRef.current },
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
      let nearbyStores = await checkNearbyStores();
      
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

        nearbyStores = [newStoreId];

        // call API for finding items
        const itemName = "item 3";
        const itemPrice = 1;
        await addNewItem(newStoreId, itemName, itemPrice);

        return nearbyStores;

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

        return nearbyStores;
      }
    };

    const displayItems = async (nearbyStores: number[]) => {
      const results = [];
      for (const store of nearbyStores) {
        try{
          const storeName = await axios.get("/api/store/getname", {
            params: { storeId: store },
          });

          const item = await axios.get("/api/item/display", {
            params: { StoreID: store, ProductID: productID }
          });

          // alert("Item ID: " + item.data[0].ID);
          // alert("Store ID: " + item.data[0].Store_ID);
          results.push({
            storeName: storeName.data.Name,
            items: item.data.map((item: { Name: string; Price: number, Store_ID: number, Product_ID: number, Item_ID: number, ID: number }) => ({
              Name: item.Name,
              Price: item.Price,
              Store_ID: item.Store_ID,
              Product_ID: item.Product_ID,
              Item_ID: item.ID,
            }))
          });

        }
        catch (error) {
          console.log("Error fetching Stores/Items", error);
        }
      }

      return results;
    };

    const fetchAndDisplay = async () => {
      setLoading(true);
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        cachedDataRef.current = JSON.parse(cached); 
        setLoading(false);
        return;
      }

      const nearbyStores = await fetchStoresAndItems();
      const results = await displayItems(nearbyStores);
      sessionStorage.setItem(cacheKey, JSON.stringify(results));
      cachedDataRef.current = results; 
      setLoading(false); 
    };

    fetchAndDisplay();
  }, [productID]);
  return (
    <div className="container mx-auto px-4 py-6">
      {cachedDataRef.current ? (
        <div className="mt-4 space-y-4">
          {cachedDataRef.current.map((store, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{store.storeName}</h2>
              <div className="mt-2 space-y-2">
                {store.items.map((item, j) => (
                  <div key={j} className="flex justify-between py-2 border-b">
                    <span>{item.Name}</span>
                    <span className="font-medium">${item.Price}</span>
                    <button
                      onClick={() => {
                        if (item) {
                          navigate({
                            to: "/create-order", // Navigate to the create-order route
                            state: {...item, storeName: store.storeName, quantity: 1, totalPrice: item.Price} // Pass the item object as state
                          });
                        } else {
                          alert('Item data is missing!');
                        }
                      }}
                      className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-gray-500">Loading product data...</div>
      )}
    </div>
  );
}