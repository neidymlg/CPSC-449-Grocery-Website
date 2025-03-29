import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

// This gets the token needed for the session.
async function getToken() {
    const client_id = process.env.kroger_client_id;
    const client_secret = process.env.kroger_client_secret;

    console.log("Client ID: ", client_id);
    console.log("Client Secret: ", client_secret);

    const response = await fetch('https://api-ce.kroger.com/v1/connect/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: client_id, // Client ID
            client_secret: client_secret, // Client secret
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
}

// This finds all the in a certain zip code.
async function getStoresByZip(zipCode) {
    const my_token = await getToken();
    const response = await fetch(`https://api-ce.kroger.com/v1/locations?filter.zipCode=${zipCode}&filter.limit=2`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${my_token}`,
            'Accept': 'application/json',
        },
    });

    const data = await response.json();
    // console.log(data);
    return data.data;
}

// This function uses a provided store and item to search.
async function searchProductInStore(query, store_id) {
    const my_token = await getToken();
    const response = await fetch(`https://api-ce.kroger.com/v1/products?filter.term=${query}&filter.locationId=${store_id}&filter.limit=2`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${my_token}`,
            'Accept': 'application/json',
        },
    });

    const data = await response.json();
    // console.log(data);
    return data.data;
}

const stores = await getStoresByZip('92832')
// const first_store_id = stores[0].locationId
// console.log(first_store_id)

// const products = await searchProductInStore('blueberries', first_store_id)
// console.log(products)                    // Shows full items response
// console.log(products[0].items)           // Shows what is in the 'items' object in the response
// console.log(products[0].items[0].price)  // Shows the pricing information contained within the 'items' object.