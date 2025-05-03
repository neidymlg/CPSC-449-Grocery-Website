const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const clientId = process.env.KROGER_CLIENT_ID;
const clientSecret = process.env.KROGER_CLIENT_SECRET;

// Endpoint to get a token
router.get("/kroger/token", async (req, res) => {
  try {
    const response = await fetch("https://api-ce.kroger.com/v1/connect/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "product.compact",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Token Error ${response.status}: ${response.statusText}`);
      console.error(errorBody);
      return res.status(response.status).json({ error: "Failed to fetch token" });
    }

    const data = await response.json();
    res.json({ token: data.access_token, expires_in: data.expires_in });
  } catch (error) {
    console.error("Error fetching token:", error);
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

// Existing endpoint to fetch locations
router.get("/kroger/locations", async (req, res) => {
  const { lat, long, radiusInMiles, limit, token } = req.query;

  try {
    const response = await fetch(`https://api-ce.kroger.com/v1/locations?filter.latLong=${lat},${long}&filter.radiusInMiles=${radiusInMiles}&filter.limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Kroger locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

router.get("/kroger/items", async (req, res) => {
  const { query, store_id, token } = req.query;

  try {
    const searchLimit = 3; // Number of items per page
    let start = 0;
    let allItems = [];
    let hasMore = true;

    while (hasMore && allItems.length < searchLimit && start < 250) { // Stop fetching once we have 5 items
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await fetch(`https://api-ce.kroger.com/v1/products?filter.term=${query}&filter.locationId=${store_id}&filter.limit=${searchLimit}&filter.start=${start}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error fetching items ${response.status}: ${response.statusText}`);
        console.error(errorBody);
        return res.status(response.status).json({ error: "Failed to fetch items" });
      }

      const data = await response.json();
      console.log("Kroger API Response:", JSON.stringify(data, null, 2));

      if (!data.data || !Array.isArray(data.data)) {
        console.error("Invalid or empty data:", data);
        return res.status(500).json({ error: "Invalid data format from Kroger API" });
      }

      // Process items: filter out those with price 0 and map to desired format
      const validItems = data.data
        .filter(item => item.items?.[0]?.price?.regular > 0) // Only keep items with price > 0
        .map(item => ({
          id: store_id,
          name: item.description || "Unknown Item",
          price: item.items[0].price.regular
        }));

      // Add only as many valid items as we need to reach 5
      const remainingSlots = searchLimit - allItems.length;
      allItems = allItems.concat(validItems.slice(0, remainingSlots));

      // Check if there are more pages and we still need more items
      const pagination = data.meta?.pagination;
      if (pagination && allItems.length < searchLimit) {
        if (pagination.start + pagination.limit < pagination.total) {
          start += searchLimit; // Move to the next page
        } else {
          hasMore = false; // No more pages
        }
      } else {
        hasMore = false; // We have enough items
      }
    }

    res.json(allItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});
module.exports = router;