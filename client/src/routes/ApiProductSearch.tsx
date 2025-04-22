import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/ApiProductSearch")({
    component: RouteComponent,
});

function RouteComponent() {
    const [searchQuery, setSearchQuery] = useState("");
    

    return (
        <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold">Search for Product</h2>
            <form onSubmit={handleSearch} className="px-10">
                <input
                    type="text"
                    placeholder="Search for items..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} />
            </form>
        </div>
    )
}
