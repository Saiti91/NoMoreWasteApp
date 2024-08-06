require('dotenv').config();
const mysql = require('mysql2/promise');

const connectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
};

async function getConnection() {
    try {
        const connection = await mysql.createConnection(connectionOptions);
        console.log("Connected to the database successfully");
        return connection;
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        throw error;
    }
}

module.exports = getConnection;
