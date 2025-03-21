// const mysql = require('mysql2/promise');
import mysql from 'mysql2/promise';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Grocery',
    port: 3307, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, 
};


//starts connection
async function startPool(){
    try {
        const pool = await mysql.createPool(dbConfig);
        console.log("Pool Created.")
        return pool;
    } catch (error) {
        console.error("Error testing connection:", error);
        process.exit(1);  
    }
}

//this is a database test, might delete later
async function testConnection(connection){
    try {
        const [results, fields] = await connection.query('SELECT * FROM test'); // Use an actual table for testing
        const id = results.map(row => row.id);
        return id;
    } catch (error) {
        console.error("Error testing connection:", error);
        process.exit(1);  
    }
}

//stops connection
async function closePool(connection) {
    try {
       await connection.end();
       console.log("Connection closed.");
    } catch (error) {
        console.error("Error closing period:", error);
        process.exit(1);
    }
}


/* 
==========================================================
==========================================================
                Insert Into Tables
==========================================================
==========================================================
*/
// After user searches Product, it will be added into the db
// Return the ID of the Store so we can insert into Item table
// async function addProduct(connection, pname){
//     try {
//         const [result, fields] = await connection.query('INSERT INTO Product (Name) VALUES (?)', pname);
//         console.log("Product added:", result.insertId);
//         return result.insertId;
//     } catch (error) {
//         console.error("Error adding product:", error);
//     }
// }

// For each Store, add the location and name
// Return the ID of the Store so we can insert into Item table
// async function addStore(connection, storeJson){
//     try {
//         const { LONG, LAT, Name } = storeJson;
//         const [result, fields] = await connection.query('INSERT INTO Store (geom_loc, Name) VALUES (Point(?, ?), ?)', [LONG, LAT, Name]);
//         console.log("Store added:", result.insertId);
//         return result.insertId;
//     } catch (error) {
//         console.error("Error adding store:", error);
//     }
// }

// For each Item (from Store and Product), add the name and ID
// async function addItem(connection, itemJson){
//     try {
//         const { StoreID, ProductID, Name, Price } = itemJson;
//         const [result, fields] = await connection.query('INSERT INTO Item (Store_ID, Product_ID, Name, Price) VALUES (?, ?, ?, ?)', [StoreID, ProductID, Name, Price]);
//         console.log("Store item added:", result.insertId);
//         return result.insertId;
//     } catch (error) {
//         console.error("Error adding store item:", error);
//     }
// }

// Adds in User 
// Might need to return ID for Order table
async function addUser(connection, userJson) {
    try {
        const { UserName, Password } = userJson;
        const [result, fields] = await connection.query('INSERT INTO User (User_Name, Password) VALUES (?, ?)', [UserName, Password]);
        console.log("User added:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("Error adding user:", error);
    } 
}

// Adds in Order
async function addOrder(connection, orderJson) {
    try {
        const { UserID, ProductID, Quantity, Price } = orderJson;
        const [result, fields] = await connection.query('INSERT INTO Order (User_ID, Product_ID, Quantity, Price) VALUES (?, ?, ?, ?)', [UserID, ProductID, Quantity, Price]);
        console.log("Order added:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("Error adding order:", error);
    } 
}

async function addUser_Order(connection, user_OrderJson) {
    try {
        const { Item_ID, Store_ID, Product_ID, Order_ID } = user_OrderJson;
        const [result, fields] = await connection.query('INSERT INTO User_Order (Item_ID, Store_ID, Product_ID, Order_ID) VALUES (?, ?)', [Item_ID, Store_ID, Product_ID, Order_ID]);
        console.log("User Order added:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("Error adding user order:", error);
    } 
}

async function addUser_Location(connection, user_LocationJson) {
    try {
        const { UserID, LONG, LAT } = user_LocationJson;
        const [result, fields] = await connection.query('INSERT INTO User_Location (User_ID, user_loc) VALUES (?, Point(?, ?))', [UserID, LONG, LAT]);
        console.log("User Location added:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("Error adding user location:", error);
    } 
}
/* 
==========================================================
==========================================================
                Show From Tables
==========================================================
==========================================================
*/
// Check location
async function checkUserLocation(connection, LONG, LAT){
    try {
        const [results, fields] = await connection.query('SELECT COUNT(*) FROM (SELECT ST_Distance_Sphere(user_loc, POINT(?, ?)) AS distance FROM User_Location HAVING distance < 750) AS Amount_Nearby', [LONG, LAT]);
        return results;
    } catch (error) {
        console.error("Error checking location:", error);
    }
}

// async function checkStoreLocation(connection, LONG, LAT){
//     try {
//         const [results, fields] = await connection.query('SELECT ID FROM Store WHERE ST_Distance_Sphere(geom_loc, POINT(?, ?)) < 750;', [LONG, LAT]);
//         return results;
//     } catch (error) {
//         console.error("Error checking location:", error);
//     }
// }

// async function checkProduct(connection, pname){
//     try {
//         const [results, fields] = await connection.query('SELECT ID FROM Product WHERE Name = ?', pname);
//         return results;
//     } catch (error) {
//         console.error("Error checking product:", error);
//     }
// }

// async function checkItem(connection, StoreID, ProductID){
//     try {
//         const [results, fields] = await connection.query('SELECT Name, Price FROM Item WHERE Store_ID = ? AND Product_ID = ?', [StoreID, ProductID]);
//         return results;
//     } catch (error) {
//         console.error("Error checking item:", error);
//     }
// }

//items that have not been refreshed
// async function checkcurrDayItem(connection, StoreID, ProductID){
//     try {
//         const [results, fields] = await connection.query('SELECT Name, Price FROM Item WHERE Store_ID = ? AND Product_ID = ? AND DATE(Date) != CURDATE()', [StoreID, ProductID]);
//         return results;
//     } catch (error) {
//         console.error("Error checking item:", error);
//     }
// }



/* 
==========================================================
==========================================================
                Update From Tables
==========================================================
==========================================================
*/

async function updateItemPrice(connection, updateItem){
    try {
        const { ItemID, StoreID, ProductID, Price } = updateItem;
        const [results, fields] = await connection.query('UPDATE Item SET Price = ?, , TS = CURRENT_TIMESTAMP WHERE Store_ID = ? AND Product_ID = ? AND ID = ?', [Price, ProductID, StoreID, ItemID]);
        console.log("Item updated:", results.affectedRows);
        return results;
    } catch (error) {
        console.error("Error updating item:", error);
    }
}

export { startPool, testConnection, closePool, addProduct };