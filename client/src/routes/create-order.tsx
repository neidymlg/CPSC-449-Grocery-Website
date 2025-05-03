import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const Route = createFileRoute('/create-order')({
  component: RouteComponent,
});

// Define the type for cached items
type CachedItem = {
  Item_ID: number;
  Store_ID: string;
  Product_ID: number;
  Name: string;
  Price: number;
  storeName: string; 
  quantity: number; 
  totalPrice: number; 
};

function RouteComponent() {
  const location = useLocation();
  const item = location.state as unknown as CachedItem; // Access the passed item object
  const [cachedItems, setCachedItems] = useState<CachedItem[]>([]); // Explicitly define the type
  const [customName, setCustomName] = useState<string>(''); // Customizable name
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  if (!item) {
    return <div className="text-center text-red-500">No item data provided!</div>;
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch the user ID first
        const response = await axios.get("/api/user/current-user");
        setUserId(response.data.user.id);
  
        // Then load cached items
        const items = JSON.parse(sessionStorage.getItem('orderItems') || '[]') as CachedItem[];
        setCachedItems(items);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
  
    initialize(); // Call the async function
  
  }, []);

  // Add the current item to the cache
  const handleAddItemToCache = () => {
    const existingItemIndex = cachedItems.findIndex(  
      //checks if items are already existing
      (cachedItem) =>
        cachedItem.Item_ID === item.Item_ID &&
        cachedItem.Store_ID == item.Store_ID &&
        cachedItem.Product_ID === item.Product_ID
    );

    let updatedItems;

    if (existingItemIndex !== -1) {
      // If the item already exists, update its quantity and totalPrice
      updatedItems = [...cachedItems];
      const existingItem = { ...updatedItems[existingItemIndex] }; // Create a shallow copy of the existing item, so as not to affect the original price
      existingItem.quantity += 1;
      existingItem.totalPrice = parseFloat((existingItem.quantity * existingItem.Price).toFixed(2));
      updatedItems[existingItemIndex] = existingItem; 
   } else {
    //else just add the item, as there are no duplicates
      updatedItems = [...cachedItems, item];
   }

   //update the Session Storage
    sessionStorage.setItem('orderItems', JSON.stringify(updatedItems));
    setCachedItems(updatedItems as CachedItem[]);
  };

  // Remove an item from the cache
  const handleRemoveItemFromCache = (index: number) => {
    const items = [...cachedItems];
    const removedItem = items[index];
  
    if (removedItem.quantity > 1) {
      // Decrease quantity by 1 and changes it to the correct price
      removedItem.quantity -= 1;
      removedItem.totalPrice = parseFloat((removedItem.quantity * removedItem.Price).toFixed(2));
    } else {
      // Remove the item completely if quantity is 1
      items.splice(index, 1);
    }
  
    sessionStorage.setItem('orderItems', JSON.stringify(items));
    setCachedItems(items);
  };

  // Discard the entire order
  const handleDiscardOrder = () => {
    sessionStorage.removeItem('orderItems'); // Clear sessionStorage
    setCachedItems([]); // Clear cachedItems state
  };

  // Create the order and clear the cache
  const handleCreateOrder = async () => {
    try {

      //if their is no items, user is not logged in,  or there is no name, the user cannot create the order
      if (cachedItems.length === 0) {
        alert('No items in the order.');
        return;
      }

      if (!userId) {
        alert('User ID not found. Did you sign in?');
        return;
      }

      if (!customName) {
        alert('Please provide a name for the order.');
        return;
      }

      const order = await axios.post('/api/orders', {
        User_ID: userId,
        Total: cachedItems.reduce((total, item) => total + Number(item.totalPrice), 0).toFixed(2),
        Name: customName,
      });

      console.log("Order created successfully:", order.data);

      const userOrder = await axios.post('/api/user_order', {
        Order_ID: order.data.id,
        items: cachedItems,
      });

      console.log("Order items added successfully:", userOrder.data.message);

      //deletes all items from the cache
      sessionStorage.removeItem('orderItems');
      setCachedItems([]);

      //navigates to the page
      navigate({
        to: "/findproduct",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Customizable Name Input */}
      <div className="mb-6 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Shopping List"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
        />
      </div>

      {/* Shopping List Container */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow overflow-y-auto" style={{ maxHeight: '300px' }}>
        {cachedItems.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {cachedItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center px-4 py-2">
                <div>
                  <p className="font-bold">{item.Name}</p>
                  <p className="text-gray-500">Total Price: ${item.totalPrice}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-xs text-gray-500">{item.Store_ID}. {item.storeName}</p>
                </div>
                <button
                  onClick={() => handleRemoveItemFromCache(index)}
                  className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center p-4">No items in the order.</p>
        )}
      </div>

      {/* Buttons Outside the Container */}
      <div className="mt-6 w-full max-w-2xl flex justify-between">
        <button
          onClick={handleAddItemToCache}
          className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-6 py-3"
        >
          Add Item to Order
        </button>
        <button
          onClick={handleCreateOrder}
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3"
        >
          Confirm Order
        </button>
        <button
          onClick={handleDiscardOrder}
          className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-6 py-3"
        >
          Discard Order
        </button>
      </div>
    </div>
  );
}
