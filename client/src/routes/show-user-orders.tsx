import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';

//=====================================================================================
// REPLACE WITH THE ACTUAL USER ID
//
const userID = 1;
//======================================================================================

export const Route = createFileRoute('/show-user-orders')({
  component: RouteComponent,
});

type Order = {
  ID: number;
  Name: string;
  Total: number;
};

type OrderItem = {
  Item_ID: number;
  Quantity: number;
  Individual_Total: number;
};

function RouteComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Fetch all orders
  useEffect(() => {
    //gets all orders based on userID 
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/display', { params: { User_ID: userID } });
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch items for a specific order
  const handleViewOrderItems = async (orderId: number) => {
    try {
      const response = await axios.get('/api/user_order/display', {
        params: { Order_ID: orderId },
      });
      console.log('Fetched order items:', response.data);
      setSelectedOrder(orders.find(order => order.ID === orderId) || null);
      setOrderItems(response.data);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  // Close the items view
  const handleCloseItemsView = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

// Delete an order
// Update the handleDeleteOrder function
const handleDeleteOrder = async (orderId: number) => {

    try {
      // Deletes Items in Orders
      const user_order_res = await axios.delete('/api/user_order/delete', {
        params: { Order_ID: orderId } // Fixed parameter name
      });
      console.log('User_Order deleted:', user_order_res.data.message);
  
      //Deletes actual Order
      const order_res = await axios.delete('/api/orders/delete', { 
        params: { ID: orderId } 
      });
      console.log('Order deleted:', order_res.data.message);
  
      //takes out deleted order from cache
      setOrders(orders.filter(order => order.ID !== orderId));

      handleCloseItemsView();
      //if (selectedOrder?.ID === orderId) handleCloseItemsView();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  
  // updates name
  const handleUpdateOrderName = async (orderId: number, newName: string) => {
    try {
      await axios.put('/api/orders/update', { ID: orderId, Name: newName });

      //finds order to update, changes its name in the cached list
      setOrders(orders.map(order =>
        order.ID === orderId ? { ...order, Name: newName } : order 
      ));
    } catch (error) {
      console.error('Error updating order name:', error);
    }
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Orders</h1>

      {/* Orders List */}
      <div className="mb-6">
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order.ID} className="flex justify-between items-center py-2">
                <div>
                  <input
                    type="text"
                    value={order.Name}
                    onChange={(e) => handleUpdateOrderName(order.ID, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                  <p className="text-gray-500">Total: ${order.Total}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewOrderItems(order.ID)}
                    className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    View Items
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.ID)}
                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>

      {/* Order Items */}
      {selectedOrder && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Items in Order: {selectedOrder.Name}</h2>
          {orderItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {orderItems.map(item => (
                <li key={item.Item_ID} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-bold">{item.Item.Item_Name}</p>
                    <p className="text-gray-500">Quantity: {item.Quantity}</p>
                    <p className="text-gray-500">Total: ${item.Individual_Total}</p>
                    <p className="text-gray-500">Store: {item.Item.Store.Name}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items found in this order.</p>
          )}
          <button
            onClick={handleCloseItemsView}
            className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 mt-4"
          >
            Close Items
          </button>
        </div>
      )}
    </div>
  );
}
