import {
  createFileRoute,
  useParams,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

import axios from "axios";

export const Route = createFileRoute("/display-items/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  //gets productID from findproduct.tsx, this will show up in the url
  const { id: productID } = useParams({ from: "/display-items/$id" });
  const search = useSearch({ from: "/display-items/$id" });
  const productName = search.name; // Access the `name` parameter

  if (!productName) {
    alert("Error in finding product name");
    return;
  }
  //for storing lat/long per rerender (so it does not have to go to sessionStorage everytime )
  const latitudeRef = useRef<string | null>(null);
  const longitudeRef = useRef<string | null>(null);

  //storing information for rerender
  const cachedDataRef = useRef<
    | {
        storeName: string;
        items: {
          Name: string;
          Price: number;
          Store_ID: string;
          Product_ID: number;
          Item_ID: number;
          ID: number;
        }[];
      }[]
    | null
  >(null);

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
          console.log(
            "Using stored location:",
            storedLatitude,
            storedLongitude
          );
        } else {
          //get geolocation of user
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(resolve, reject);
                } else {
                  reject(
                    new Error("Geolocation is not supported by this browser.")
                  );
                }
              }
            );

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
      try {
        const response = await fetch("/api/kroger/token");
        if (!response.ok) {
          console.error(
            `Token Error ${response.status}: ${response.statusText}`
          );
          return null;
        }

        const data = await response.json();
        return data.token; // Return the token from the backend
      } catch (error) {
        console.error("Error fetching token:", error);
        return null;
      }
    }

    // Finds 10 Stores near the provided latitude and longitude.
    async function findStores(LAT: string, LONG: string) {
      try {
        const token = await getToken();
        const searchLimit = 5;
        const searchRange = 1;

        // Fetch stores from the backend proxy
        const response = await axios.get(`/api/kroger/locations`, {
          params: {
            lat: LAT,
            long: LONG,
            radiusInMiles: searchRange,
            limit: searchLimit,
            token: token,
          },
        });

        // Check if the response is valid
        if (!response.data || !response.data.data) {
          console.error(
            "Invalid response from /api/kroger/locations:",
            response.data
          );
          alert("No stores found.");
          return [];
        }

        const data = response.data.data;

        // Log and alert the store IDs
        const returnedData = [];
        for (let i = 0; i < data.length; i++) {
          const storeData = {
            id: data[i].locationId,
            name: data[i].name,
            lat: data[i].geolocation.latitude,
            long: data[i].geolocation.longitude,
          };
          returnedData.push(storeData);
        }

        return returnedData;
      } catch (error) {
        console.error("Error in findStores:", error);
        alert("Failed to fetch stores. Please try again.");
        return [];
      }
    }

    async function findItem(query: string, store_id: string) {
      try {
        const my_token = await getToken(); // Fetch the token from the backend

        const response = await axios.get(`/api/kroger/items`, {
          params: {
            query: query,
            store_id: store_id,
            token: my_token,
          },
        });

        if (!response.data || response.data.length === 0) {
          console.warn("No items found for query:", query);
          return [];
        }

        console.log("Items fetched:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error in findItem:", error);
        alert("Failed to fetch items. Please try again.");
        return [];
      }
    }

    const processBatchAndAddItems = async (storeId: string, query: string) => {
      try {
        // Fetch a batch of items using findItem
        const itemsBatch = await findItem(query, storeId);

        if (!itemsBatch || itemsBatch.length === 0) {
          console.warn("No items found for the query:", query);
          return;
        }

        // Iterate over the batch and add each item
        for (const item of itemsBatch) {
          const itemName = item.name;
          const itemPrice = item.price;

          try {
            // Call addNewItem for each item
            await addNewItem(storeId, itemName, itemPrice);
            console.log(
              `Successfully added item: ${itemName} with price: ${itemPrice}`
            );
          } catch (error) {
            console.error(`Error adding item: ${itemName}`, error);
          }
        }
      } catch (error) {
        console.error("Error processing batch and adding items:", error);
      }
    };

    /******************************************************************************/

    //checks if we have stored any nearby stores, passes the storeID
    const checkNearbyStores = async () => {
      try {
        const response = await axios.get("/api/store/check", {
          params: { LONG: longitudeRef.current, LAT: latitudeRef.current },
        });
        return response.data;
      } catch (error) {
        console.log("Error fetching Stores", error);
      }
    };

    //checks if items have not updated recently, returns all item information
    const checkItemsForCurrentDay = async (storeIDs: string[]) => {
      try {
        const response = await axios.get("/api/item/check_current_day", {
          params: { StoreIDs: storeIDs.join(","), ProductID: productID },
        });
        return response.data;
      } catch (error) {
        console.error("Error checking items for the current day:", error);
        throw error;
      }
    };

    //adds new store, returns id of all stores
    const addNewStore = async (
      storeID: string,
      longitude: number,
      latitude: number,
      name: string
    ) => {
      try {
        const response = await axios.post("/api/store", {
          storeID: storeID,
          LONG: longitude,
          LAT: latitude,
          Name: name,
        });
        console.log("Successfully read data for Store ID: ", response.data.id);
      } catch (error) {
        console.error("Error adding new store:", error);
        throw error;
      }
    };

    //adds new item into empty store
    const addNewItem = async (storeId: string, name: string, price: number) => {
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
    const updateItem = async (
      itemId: number,
      storeId: string,
      price: number
    ) => {
      try {
        const response = await axios.put(`/api/item`, {
          ID: itemId,
          StoreID: storeId,
          ProductID: productID,
          Price: price,
        });
        console.log(
          `Updated item with ID: ${itemId}, Response:`,
          response.data
        );
      } catch (error) {
        console.error(`Error updating item with ID: ${itemId}`, error);
        throw error;
      }
    };

    //checks if store doesn't have items, returns storeIDS
    const checkEmptyStores = async (storeIDs: string[]) => {
      try {
        const response = await axios.get("/api/item/check_no_items", {
          params: {
            StoreIDs: storeIDs.join(","),
            ProductID: productID,
          },
        });
        return response.data.emptyStoreIDs; // Returns array of store IDs
      } catch (error) {
        console.error("Error checking empty stores:", error);
        throw error;
      }
    };

    const fetchStoresAndItems = async () => {
      let nearbyStores = await checkNearbyStores();

      // if: for new stores and items
      // else: for nearby stores
      if (!nearbyStores || nearbyStores.length === 0) {
        const stores = await findStores(
          latitudeRef.current,
          longitudeRef.current
        );

        for (let i = 0; i < stores.length; i++) {
          const storeID = stores[i].id.toString();
          const storeLat = stores[i].lat;
          const storeLon = stores[i].long;
          const storeName = stores[i].name;
          await addNewStore(storeID, storeLon, storeLat, storeName);
          nearbyStores.push(storeID); // Add the new store ID to nearbyStores
          await processBatchAndAddItems(storeID, productName);
        }

        return nearbyStores;
      } else {
        //checks if any items are out of date, returns item information
        const outdatedItems = await checkItemsForCurrentDay(nearbyStores);
        //checks if any store is empty, returns store information
        const emptyItems = await checkEmptyStores(nearbyStores);

        //if outdated, use a for loop to update
        if (outdatedItems.length > 0) {
          for (const item of outdatedItems) {
            //Call API
            const itemData = await findItem(item.Name, item.Store_ID);
            for (let i = 0; i < itemData.length; i++) {
              const itemPrice = itemData[i].price;
              await updateItem(item.ID, item.Store_ID, itemPrice);
            }
          }
        }

        if (emptyItems.length > 0) {
          for (const stores of emptyItems) {
            //Call API and insert items using the LONG/LAT to find the Stores

            const itemData = await findItem(productName, stores);

            for (let i = 0; i < itemData.length; i++) {
              const itemName = itemData[i].name;
              const itemPrice = itemData[i].price;
              await addNewItem(stores, itemName, itemPrice);
            }
            //  const itemName = "item z";
            //  const itemPrice = 10;
            //  await addNewItem(stores, itemName, itemPrice);
          }
        }

        return nearbyStores;
      }
    };

    const displayItems = async (nearbyStores: string[]) => {
      const results = [];
      //gets the store's name, and all items in the store
      for (const store of nearbyStores) {
        try {
          const storeName = await axios.get("/api/store/getname", {
            params: { storeId: store },
          });

          const item = await axios.get("/api/item/display", {
            params: { StoreID: store, ProductID: productID },
          });

          results.push({
            storeName: storeName.data.Name,
            items: item.data.map(
              (item: {
                Name: string;
                Price: number;
                Store_ID: string;
                Product_ID: number;
                Item_ID: number;
                ID: number;
              }) => ({
                Name: item.Name,
                Price: item.Price,
                Store_ID: item.Store_ID,
                Product_ID: item.Product_ID,
                Item_ID: item.ID,
              })
            ),
          });
        } catch (error) {
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
        const results = await displayItems(nearbyStores);
        const filteredResults = results.filter(store => store.items.length > 0);
        sessionStorage.setItem(
          `cachedData_${productID}`,
          JSON.stringify(filteredResults)
        );
        cachedDataRef.current = filteredResults;
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
                {store.items.map(
                  (item, j) => (
                      <div
                        key={j}
                        className="flex justify-between py-2 border-b"
                      >
                        <span className="max-w-[60%] truncate">{item.Name}</span>
                        <div>
                          <span className="font-medium pr-4 w-[60px]">
                            ${item.Price}
                          </span>
                          <button
                            onClick={() => {
                              if (item) {
                                navigate({
                                  to: "/create-order", // Navigate to the create-order route
                                  state: {
                                    ...item,
                                    storeName: store.storeName,
                                    quantity: 1,
                                    totalPrice: item.Price,
                                  }, // Pass the item object as state
                                });
                              } else {
                                alert("Item data is missing!");
                              }
                            }}
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                )}
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
