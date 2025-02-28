import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <div>
    <h2>About</h2>
    <p>Affordable Groceries seeks to help you find the most affordable items! By listing the cheapest 
      items from different stores, you can save money on the bottom line!
    </p>
  </div>
)
}
