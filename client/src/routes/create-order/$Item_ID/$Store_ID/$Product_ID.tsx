import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/create-order/$Item_ID/$Store_ID/$Product_ID',
)({
  component: RouteComponent,
})

function RouteComponent() {
    const { Item_ID, Store_ID, Product_ID } = useParams({ from: "/create-order/$Item_ID/$Store_ID/$Product_ID" });
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">    
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
      <p className="text-lg mb-2">Item ID: {Item_ID}</p>
      <p className="text-lg mb-2">Store ID: {Store_ID}</p>
      <p className="text-lg mb-2">Product ID: {Product_ID}</p>
    </div>
  );
}
