/**
 * This file contains all the functions and relative code used to test, check,
 * and try different features of the Kroger API.
 * 
 * IMPORTANT:
 * If the API call sent to the Kroger API is not valid for the location (the
 * filters used), but the token sent with it is a valid token, the default
 * location that is used when returning stores by the API is South Carolina (SC).
 * All stores returned will be from that location.
 *
 * TOKEN SETUP:
 * https://developer.kroger.com/api-products/api/authorization-endpoints-public
 * 
 * NOTE:
 * To add search params, add ?filter.PARAMETER right after the URL. Additional
 * parameters that follow can be added with &filter.PARAMETER.
 * 
 * A list of valid LOCATION parameters can be found at:
 * https://developer.kroger.com/api-products/api/location-api-partner
 * 
 * A list of valid PRODUCT parameters can be found at:
 * https://developer.kroger.com/api-products/api/location-api-partner
 * 
 * 
 * By: Omar Younis
 */



//==============================================================================
//                       Imports/Settings/Constants
//==============================================================================

// Importing the axios library to make HTTP requests.
import axios from 'axios';

// The keys is needed to create a token so that we can access the Kroger API. These
// are created when you create a user and register your app with Kroger.
const CLIENT_ID = '<ADD CLIENT ID HERE>';
const CLIENT_SECRET = '<ADD CLIENT SECRET HERE>';

// The URLS used in this file for the Kroger API.
const BASE_URL = 'https://api-ce.kroger.com/v1';
const TOKEN_URL = `${BASE_URL}/connect/oauth2/token`;
const LOCATIONS_URL = `${BASE_URL}/locations`;
const PRODUCTS_URL = `${BASE_URL}/products`;



//==============================================================================
//                             Functions
//==============================================================================

/**
 * This function creates a token that is needed to access the Kroger API. The 
 * token is sent with each requests to the API in order for it to know we are an
 * authorized user. This is done by sending a request to the Kroger API with the
 * client ID and secret. The response will contain the token that is needed to
 * access the API.
 * @returns {string|null} The token needed to access the Kroger API. If an error
 *      occurs, it returns null.
 */
async function getToken() {
    const response = await fetch(TOKEN_URL, {
        method: 'POST', // Using a POST request.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // The body of the request which has the information needed to make a
        // token.
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'product.compact',
        }),
    });
    // If response isn't 200 OK, then ruturn null and console print the error.
    if (!response.ok) {
        console.error(`Token Error ${response.status}: ${response.statusText}`);
        const errorBody = await response.text();
        console.error(errorBody); // Log the error response body
        return null;
    }
    // If the response is 200 OK, then parse the response and return the token.
    const data = await response.json(); // Response is in JSON.
    
    return data.access_token; // Return the token
}


/**
 * This function finds all stores near a certain zip code and only returns a
 * certain number of stores back, if specified. The default is 3 stores.
 * @param {string} zipCode The zip code you want to search for stores in.
 * @param {number} searchLimit The number of stores you want returned.
 *      Default is 3 stores.
 * @returns {Array} An array of stores that are in the zip code searched with.
 */
async function getStoresByZip(zipCode, searchLimit = 3) {
    // Create a valid token before doing anything.
    const my_token = await getToken();

    // Request all stores near the zip code provided based on the limit.
    const response = await fetch(`${LOCATIONS_URL}?filter.zipCode.near=${zipCode}&filter.limit=${searchLimit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${my_token}`, // Sending valid token with request.
            'Accept': 'application/json',   // Response from API is in JSON form.
        },
    });

    const data = await response.json(); // Parse the response.
    
    return data.data; // Return the data from the response.
}


/**
 * Finds all stores withing a search radius provided (in miles) at a provided lat
 * and long location. The number of stores returned can be specified but if not,
 * the default is 3 stores returned.
 * @param {number} lat The latitude of the location you want to search for.
 * @param {number} long The longitude of the location you want to search for.
 * @param {number} range The range in miles of your search area from the lat long.
 * @param {number} searchLimit The number of stores you want returned.
 *      Default is 3 stores.
 * @returns {Array} An array of stores that are in the search radius (in miles)
 *     at the lat long provided.
 */
async function getStoresByLatLong(lat, long, range, searchLimit = 3) {
    // Create a valid token before doing anything.
    const my_token = await getToken();
    // Request all stores near the lat/long provided based on the limit.
    const response = await fetch(`${LOCATIONS_URL}?filter.latLong.near=${lat},${long}&filter.radiusInMiles=${range}&.filter.limit=${searchLimit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${my_token}`, // Sending valid token with request.
            'Accept': 'application/json',   // Response from API is in JSON form.
        },
    });

    const data = await response.json(); // Parse the response.

    return data.data; // Return the data from the response.
}


/**
 * Takes a store's unique ID, a search term, an a limit for the number of returned
 * results to find products that has the search term at that store. Then returns
 * all the products that were found in the store.
 * @param {string} query The search term to look for e.g. "blueberry".
 * @param {string} store_id The ID number of the store you want to search for
 *      the item in.
 * @param {number} searchLimit The number of items you want to return from your
 *     search. Default is 3 items.
 * @returns An array of items that where found in the specified store.
 */
async function searchProductInStore(query, store_id, searchLimit = 3) {
    // Create a valid token before doing anything.
    const my_token = await getToken();

    // Request all items that has the query term in it, based on the store in
    // question and the limit of items to return.
    const response = await fetch(`${PRODUCTS_URL}?filter.term=${query}&filter.locationId=${store_id}&filter.limit=${searchLimit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${my_token}`, // Sending valid token with request.
            'Accept': 'application/json',   // Response from API is in JSON form.
        },
    });

    const data = await response.json(); // Parse the response.

    return data.data; // Return the data from the response.
}



//==============================================================================
//                      Functions -  Axios Versions
//==============================================================================

/**
 * This function creates a token that is needed to access the Kroger API, using
 * Axios. The token is sent with each requests to the API in order for it to know
 * we are an authorized user. This is done by sending a request to the Kroger API
 * with the client ID and secret. The response will contain the token that is
 * needed to access the API.
 * @returns {string|null} The token needed to access the Kroger API. If an error
 *      occurs, it returns null.
 */
async function getTokenAxios() {
    try {
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            // The body (parameters) of the request to send to the API to get a
            // usable token for the other requests.
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'product.compact',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // This is from the response. The token is in the response body in a map.
        // The key is access_token to get the token itself.
        return response.data.access_token

    // If a token wasn't able to be created, then return null and long the error.
    } catch (error) {
        console.error(`Token Error: ${error.response?.status} - ${error.response?.statusText}`);
        console.error(error.response?.data); // Log the error response body
        return null;
    }
}


/**
 * This function finds all stores near a certain zip code and only returns a
 * certain number of stores back, if specified, using Axios. The default is 3 stores.
 * @param {string} zipCode The zip code you want to search for stores in.
 * @param {number} searchLimit The number of stores you want returned.
 *      Default is 3 stores.
 * @returns {Array|null} An array of stores that are in the zip code searched
 * with, or returns null if an error occurred.
 */
async function getStoresByZipAxios(zipCode, searchLimit = 3) {
    // Create a valid token before doing anything.
    const my_token = await getTokenAxios();

    // Request all the store near the zip code provided and based on the limit.
    // Using axios and the param feature.
    try {
        const response = await axios.get(LOCATIONS_URL, {
            headers: {
                'Authorization': `Bearer ${my_token}`, // Sending valid token with request.
                'Accept': 'application/json',   // Response from API is in JSON form.
            },
            params: {
                'filter.zipCode.near': zipCode,
                'filter.limit': searchLimit,
            },
        });

        // Returns the data from the response if successful.
        return response.data.data;

    // Catch any errors that might happen and log them.
    } catch (error) {
        console.error(`Error: ${error.response?.status} - ${error.response?.statusText}`);
        console.error(error.response?.data); // Log the error response body
        
        // Returns an empty array if error occurs.
        return [];
    }
}


/**
 * Finds all stores withing a search radius provided (in miles) at a provided lat
 * and long location, using Axios. The number of stores returned can be specified
 * but if not, the default is 3 stores returned.
 * @param {number} lat The latitude of the location you want to search for.
 * @param {number} long The longitude of the location you want to search for.
 * @param {number} range The range in miles of your search area from the lat long.
 * @param {number} searchLimit The number of stores you want returned.
 *      Default is 3 stores.
 * @returns {Array} An array of stores that are in the search radius (in miles)
 *     at the lat long provided.
 */
async function getStoresByLatLongAxios(lat, long, range, searchLimit = 3) {
    // Create a valid token before doing anything.
    const my_token = await getTokenAxios();

    // Request all stores near the lat/long provided based on the limit and search
    // range. Using axios and the param feature.
    try {
        const response = await axios.get(LOCATIONS_URL, {
            headers: {
                'Authorization': `Bearer ${my_token}`, // Sending valid token with request.
                'Accept': 'application/json',   // Response from API is in JSON form.
            },
            params: {
                'filter.latLong.near': `${lat},${long}`,
                'filter.radiusInMiles': range,
                'filter.limit': searchLimit,
            },
        });

        // Returns the data from the response if successful.
        return response.data.data;

    // Catch any errors that might happen and log them.
    } catch (error) {
        console.error(`Error: ${error.response?.status} - ${error.response?.statusText}`);
        console.error(error.response?.data); // Log the error response body
        
        // Returns an empty array if error occurs.
        return [];
    }
}

/**
 * Takes a store's unique ID, a search term, an a limit for the number of returned
 * results to find products that has the search term at that store, using Axios.
 * Then returns all the products that were found in the store.
 * @param {string} query The search term to look for e.g. "blueberry".
 * @param {string} store_id The ID number of the store you want to search for
 *      the item in.
 * @param {number} searchLimit The number of items you want to return from your
 *     search. Default is 3 items.
 * @returns An array of items that where found in the specified store.
 */
async function searchProductInStoreAxios(query, store_id, searchLimit = 3) {
    // Create a valid token before doing anything.
    const my_token = await getTokenAxios();

    // Request all items that has the query term in it, based on the store in
    // question and the limit of items to return. Using axios and the param
    // feature.
    try {
        const response = await axios.get(PRODUCTS_URL, {
            headers: {
                'Authorization': `Bearer ${my_token}`, // Sending valid token with request.
                'Accept': 'application/json',   // Response from API is in JSON form.
            },
            params: {
                'filter.term': query,
                'filter.locationId': store_id,
                'filter.limit': searchLimit,
            },
        });

        // Returns the data from the response if successful.
        return response.data.data;

    // Catch any errors that might happen and log them.
    } catch (error) {
        console.error(`Error: ${error.response?.status} - ${error.response?.statusText}`);
        console.error(error.response?.data); // Log the error response body
        
        // Returns an empty array if error occurs.
        return [];
    }
}

//==============================================================================
//                           Main Code
//==============================================================================
const LAT = 33.86435534462425;            // Latitude of the Fullerton Area.
const LONG = -117.92420703655195;         // Longitude of the Fullerton Area.
const fullertonZip = '92832';   // Zip code of the Fullerton Area.
const store_id = 70300071;      // Store ID for a Ralphs near Fullerton, CA.


/**
 *                      Testing regular fetch functions.
 */
// const stores = await getStoresByZip(fullertonZip); // Get stores in the zip code.
// const stores = await getStoresByLatLong(LAT, LONG, 5, 2);
// console.log(stores); // Print the stores found in the zip code.

/**
 *                          Testing the axios functions.
 */
// const created_token = await getTokenAxios(); // Create a token to use for the API.
// console.log(`Token: ${created_token}`); // Print the token created.
// const stores = await getStoresByZipAxios(fullertonZip); // Get stores in the zip code.
// console.log(stores); // Print the stores found in the zip code.
const stores = await getStoresByLatLongAxios(LAT, LONG, 5, 2);
console.log(stores); // Print the stores found in the lat/long.
// const products = await searchProductInStoreAxios('blueberry', store_id, 5); // Search for blueberries in the store.
// console.log(products); // Print the products found in the store.