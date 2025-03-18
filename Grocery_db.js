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
async function addProduct(connection, pname){
    try {
        const [result, fields] = await connection.query('INSERT INTO Product (Name) VALUES (?)', pname);
        console.log("Product added:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("Error adding product:", error);
    }
}

async function addStore(connection, storeJson){
    try {
        const { LONG, LAT, Name } = storeJson;
        const [result, fields] = await connection.query('INSERT INTO Store (geom_loc, Name) VALUES (Point(?, ?), ?)', [LONG, LAT, Name]);
        console.log("Store added:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("Error adding store:", error);
    }
}

async function addItem(connection, itemJson){
    try {
        const { StoreID, ProductID, Name } = itemJson;
        const [result, fields] = await connection.query('INSERT INTO Item (Store_ID, Product_ID, Name) VALUES (?, ?, ?)', [StoreID, ProductID, Name]);
        console.log("Store item added:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("Error adding store item:", error);
    }
}

async function addPrice(connection, priceJson) {
    try {
        const { StoreID, ProductID, ItemID, Price } = priceJson;
        await connection.query('INSERT INTO Price (Store_ID, Product_ID, Item_ID, Price) VALUES (?, ?, ?, ?)', [StoreID, ProductID, ItemID, Price]);
    } catch (error) {
        console.error("Error adding price:", error);
    } 
}

async function addUser(connection, userJson) {
    try {
        const { UserName, Password } = userJson;
        const [result, fields] = await connection.query('INSERT INTO User (User_Name, Password) VALUES (?, ?)', [UserName, Password]);
    } catch (error) {
        console.error("Error adding user:", error);
    } 
}

async function addOrder(connection, orderJson) {
    try {
        const { UserID, ProductID, Quantity, Price } = orderJson;
        const [result, fields] = await connection.query('INSERT INTO Order (User_ID, Product_ID, Quantity, Price) VALUES (?, ?, ?, ?)', [UserID, ProductID, Quantity, Price]);
    } catch (error) {
        console.error("Error adding order:", error);
    } 
}

/* 
==========================================================
==========================================================
                Show From Tables
==========================================================
==========================================================
*/
// If User is in new location
async function showStore(connection, storeJson){
    try {
        const [results, fields] = await connection.query('SELECT * FROM ITEM WHERE Store_ID = ? ', storeItem);
        return results;
    } catch (error) {
        console.error("Error showing items:", error);
    }
}

async function showProduct(connection){
    try {
        const [results, fields] = await connection.query('SELECT * FROM Product');
        return results;
    } catch (error) {
        console.error("Error showing product:", error);
    }
}

// If User is in previous location


// Check location

export { startPool, testConnection, closePool, addProduct };