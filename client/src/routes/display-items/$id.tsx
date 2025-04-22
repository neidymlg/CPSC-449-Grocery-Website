import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

import axios from "axios";

// Importing and setting up the configuration for dotenv to use environment variables.
import dotenv from "dotenv";
dotenv.config({path: '../../../../.env'}); // Load environment variables from .env file


export const Route = createFileRoute("/display-items/$id")({
    component: RouteComponent,
  });


function RouteComponent() {
  //gets productID from findproduct.tsx, this will show up in the url
  const { id: productID } = useParams({ from: "/display-items/$id" });

  //for storing lat/long per rerender (so it does not have to go to sessionStorage everytime )
  const latitudeRef = useRef<string | null>(null); 
  const longitudeRef = useRef<string | null>(null);

  //storing information for rerender
  const cachedDataRef = useRef<{
    storeName: string;
    items: { Name: string; Price: number; Store_ID: number; Product_ID: number; Item_ID: number; ID: number }[];
  }[] | null>(null);

  // used to ensure the async function/cached items loads
  const [loading, setLoading] = useState(true);

  // for navigating to next page
  const navigate = useNavigate();
  

  useEffect(() => {

    //fetches user's lat/long
    const fetchLocation = async () => { 
      // if location is already stored, will skip
      if (!latitudeRef.current || !longitudeRef.current) {

        //if: gets lat/long from sessionStroage to store in Ref (Ref is faster/efficient that SessionStorage)
        //else: store in sessionStorage
        const storedLatitude = sessionStorage.getItem("latitude");
        const storedLongitude = sessionStorage.getItem("longitude");
    
        if (storedLatitude && storedLongitude) {
          latitudeRef.current = storedLatitude;
          longitudeRef.current = storedLongitude;
          console.log("Using stored location:", storedLatitude, storedLongitude);
        } else {
          //get geolocation of user
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
    
            //set the values into the sessionStorage, so  if user reloads session, it will not need to ask again
            sessionStorage.setItem("latitude", lat);
            sessionStorage.setItem("longitude", lon);
    
            //sets the values into Reference to avoid redoing function if rerendering 
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



/******************************************************************************/


    // Creates a token needed for the API session.
    async function getToken() {
      const clientId = process.env.KROGER_CLIENT_ID;
      const clientSecret = process.env.KROGER_CLIENT_SECRET;

      const response = await fetch('https://api-ce.kroger.com/v1/connect/oauth2/token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              grant_type: 'client_credentials',
              client_id: clientId ?? '',
              client_secret: clientSecret ?? '',
              scope: ' product.compact',
          }),
      });
  
      if (!response.ok) {
          console.error(`Token Error ${response.status}: ${response.statusText}`);
          const errorBody = await response.text();
          console.error(errorBody); // Log the error response body
          return null;
      }
  
      const data = await response.json();
      return data.access_token; // Return the token
  };

  // Finds 10 Stores near the provided latitude and longitude.
  async function findStores(LAT: string, LONG: string) {
      const my_token = await getToken();
      const searchLimit = 10;
      const searchRange = 10;   // The range in miles to search for stores from the LAT and LONG provided.
      const response = await fetch(`https://api-ce.kroger.com/v1/locations?filter.latLong.near=${LAT},${LONG}&filter.radiusInMiles=${searchRange}&filter.limit=${searchLimit}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${my_token}`,
              'Accept': 'application/json',
          },
      });
      
      // Get the data from the json response.
      const data = await response.json();
      const returnedData = [];
      for (let i =0; i < data.data.length; i++) {
        const storeData = {
          "id": data.data[i].locationId,
          "name": data.data[i].name,
          "lat": data.data[i].geolocation.latitude,
          "long": data.data[i].geolocation.longitude,
        };
        returnedData.push(storeData);
      }
      return returnedData;
  };


  async function findItem(query: string, store_id: string) {
    const my_token = await getToken();
    const searchLimit = 5;
    const response = await fetch(`https://api-ce.kroger.com/v1/products?filter.term=${query}&filter.locationId=${store_id}&filter.limit=${searchLimit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${my_token}`,
            'Accept': 'application/json',
        },
    });
    const data = await response.json();
    const returnedData = [];
    for (let i = 0; i < data.data.length; i++) {
      const itemData = {"id": store_id,
                        "name": data.data[i].description,
                        "price": data.data[i].items[0].price.regular
      };
      returnedData.push(itemData);
    }
    return returnedData;
  }


/******************************************************************************/


    //checks if we have stored any nearby stores, passes the storeID
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
  
    //checks if items have not updated recently, returns all item information
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
    
    //adds new store, returns id of all stores
    const addNewStore = async (storeID: number, longitude: number, latitude: number, name: string) => {
      try {
        const response = await axios.post("/api/store", {
          storeID: storeID,
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

    //adds new item into empty store
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

    //updates item's price
    const updateItem = async (itemId: number, storeId: number, price: number) => {
      try {
        const response = await axios.put(`/api/item`, {
          ID: itemId,
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

    //checks if store doesn't have items, returns storeIDS
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

    //DELETE ???????
    // const getLongLat = async (storeID: number) =>{
    //   try {
    //     const response = await axios.get(`/api/store/${storeID}`);
    //     return response;
    //   } catch (error) {
    //     console.error("Error with fetching long/lat:", error);
    //     throw error;
    //   }
    // }

    const fetchStoresAndItems = async () => {
      let nearbyStores = await checkNearbyStores();
      
      // if: for new stores and items
      // else: for nearby stores
      if (!nearbyStores || nearbyStores.length === 0) {
        // ADD API to this section !!!!!
        const stores = await findStores(latitudeRef.current, longitudeRef.current);

        for (let i = 0; i < stores.length; i++) {
          const storeID = stores[i].id;
          const storeLat = stores[i].lat;
          const storeLon = stores[i].long;
          const storeName = stores[i].name;
          await addNewStore(storeID, storeLon, storeLat, storeName);
          nearbyStores.push(storeID); // Add the new store ID to nearbyStores
        }
        // const storeID = 1;
        // const storeLat = 33.7572;
        // const storeLon = -117.9111;
        // const storeName = "Store Name 6";
        // await addNewStore(storeID, storeLon, storeLat, storeName);

        // nearbyStores.push(storeID); // Add the new store ID to nearbyStores

        // call API for finding items
        for (let i = 0; i < stores.length; i++) {
          const itemData = await findItem('blueberries', stores[i].id);
          const itemName =itemData[i].name;
          const itemPrice = itemData[i].price;
          await addNewItem(stores[i].id, itemName, itemPrice);
        }
        // const itemName = "item 3";
        // const itemPrice = 1;
        // await addNewItem(storeID, itemName, itemPrice);

        return nearbyStores;

      }
      else{
       //checks if any items are out of date, returns item information
       const outdatedItems = await checkItemsForCurrentDay(nearbyStores);
       //checks if any store is empty, returns store information
       const emptyItems = await checkEmptyStores(nearbyStores);
        
       //if outdated, use a for loop to update
        if (outdatedItems.length > 0) {
            for (const item of outdatedItems) {
              //Call API 
              const itemData = await findItem(item.Name, item.Store_ID);
              const itemPrice = itemData[0].price;

              // const itemPrice = 10;
              await updateItem(item.ID, item.Store_ID, itemPrice);
            }
        }

        if(emptyItems.length > 0){
          for (const stores of emptyItems){
            //Call API and insert items using the LONG/LAT to find the Stores

            const itemData = await findItem('blueberries', stores);

            for (let i = 0; i < itemData.length; i++) {
              const itemName = itemData[0].name;
              const itemPrice = itemData[0].price;
              await addNewItem(stores, itemName, itemPrice);
            }
          }
        }

        return nearbyStores;
      }
    };

    const displayItems = async (nearbyStores: number[]) => {
      const results = [];
      //gets the store's name, and all items in the store
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
    try {
      setLoading(true);
      // Ensure location is fetched first, and cachedItems are loaded first 
      await fetchLocation();
      const cached = sessionStorage.getItem(`cachedData_${productID}`);
      
      //if cached items exist, parse them, set loading to false and stop
      if (cached) {
        cachedDataRef.current = JSON.parse(cached); 
        setLoading(false);
        return;
      }

      //if not, get all stores and items, set the cached items in sessionStorage
      const nearbyStores = await fetchStoresAndItems();
      if (!nearbyStores) throw new Error("Failed to fetch nearby stores.");

      const results = await displayItems(nearbyStores);
      sessionStorage.setItem(`cachedData_${productID}`, JSON.stringify(results));
      cachedDataRef.current = results; 
      setLoading(false); 
    } catch (error) {
      console.error("Error in fetchAndDisplay:", error);
      alert("An error occurred while loading data. Please try again.");
      setLoading(false);
    }
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