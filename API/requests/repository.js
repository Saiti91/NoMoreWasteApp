const getConnection = require("../common/db_handler");

// Create a new request
async function createOne(request) {
    if (!request) {
        throw new Error("createOne: request object must be defined");
    }
    const connection = await getConnection();
    const query = `
        INSERT INTO Requests (Product_ID, Quantity, Date, User_ID, Route_ID, Processed, Processed_Date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        request.Product_ID,
        request.Quantity,
        request.Date,
        request.User_ID,
        request.Route_ID || null,  // Route_ID can be null
        request.Processed || false,  // Default to false if not provided
        request.Processed_Date || null  // Allow null if not processed yet
    ];
    const [result] = await connection.execute(query, values);
    await connection.end();
    return { Request_ID: result.insertId, ...request };
}

// Get a request by a specific attribute
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const connection = await getConnection();
    const query = `
        SELECT r.Request_ID,
               r.Quantity,
               r.Date AS Request_Date,
               r.Route_ID,
               r.Processed,
               r.Processed_Date,
               JSON_OBJECT(
                       'User_ID', u.User_ID,
                       'Name', u.Name,
                       'Firstname', u.Firstname,
                       'Email', u.Email
               ) AS User,
               JSON_OBJECT(
                       'Product_ID', p.Product_ID,
                       'Name', p.Name,
                       'Barcode', p.Barcode,
                       'Category', c.Name
               ) AS Product
        FROM Requests r
                 LEFT JOIN Users u ON r.User_ID = u.User_ID
                 LEFT JOIN Products p ON r.Product_ID = p.Product_ID
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
        WHERE r.${attribute} = ?
    `;
    const [rows] = await connection.execute(query, [value]);
    await connection.end();
    return rows.length > 0 ? rows.map(row => ({
        Request_ID: row.Request_ID,
        Quantity: row.Quantity,
        Request_Date: row.Request_Date,
        Route_ID: row.Route_ID,
        Processed: row.Processed,
        Processed_Date: row.Processed_Date,
        User: typeof row.User === 'string' ? JSON.parse(row.User) : row.User,
        Product: typeof row.Product === 'string' ? JSON.parse(row.Product) : row.Product
    })) : null;
}

async function getAllWithoutRoute() {
    const connection = await getConnection();
    const query = `
        SELECT
            r.Request_ID,
            r.Quantity,
            r.Date AS Request_Date,
            JSON_OBJECT(
                    'User_ID', u.User_ID,
                    'Name', u.Name,
                    'Firstname', u.Firstname,
                    'Email', u.Email
            ) AS User,
            JSON_OBJECT(
                    'Product_ID', p.Product_ID,
                    'Name', p.Name,
                    'Barcode', p.Barcode,
                    'Category', c.Name
            ) AS Product,
            JSON_OBJECT(
                    'Address_ID', a.Address_ID,
                    'Street', a.Street,
                    'City', a.City,
                    'State', a.State,
                    'Postal_Code', a.Postal_Code,
                    'Country', a.Country
            ) AS Address
        FROM Requests r
                 LEFT JOIN Users u ON r.User_ID = u.User_ID
                 LEFT JOIN Products p ON r.Product_ID = p.Product_ID
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
                 LEFT JOIN Address a ON u.Address_ID = a.Address_ID
        WHERE r.Route_ID IS NULL;
    `;
    const [rows] = await connection.execute(query);
    await connection.end();

    // Group requests by address
    const groupedByAddress = rows.reduce((acc, row) => {
        const address = typeof row.Address === 'string' ? JSON.parse(row.Address) : row.Address;
        const request = {
            Request_ID: row.Request_ID,
            Quantity: row.Quantity,
            Request_Date: row.Request_Date,
            User: typeof row.User === 'string' ? JSON.parse(row.User) : row.User,
            Product: typeof row.Product === 'string' ? JSON.parse(row.Product) : row.Product,
        };

        if (!acc[address.Address_ID]) {
            acc[address.Address_ID] = {
                Address: address,
                Requests: []
            };
        }
        acc[address.Address_ID].Requests.push(request);

        return acc;
    }, {});

    // Convert the result to an array
    return Object.values(groupedByAddress);
}

// Get all requests
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT r.Request_ID,
               r.Quantity,
               r.Date AS Request_Date,
               r.Route_ID,
               r.Processed,
               r.Processed_Date,
               JSON_OBJECT(
                       'User_ID', u.User_ID,
                       'Name', u.Name,
                       'Firstname', u.Firstname,
                       'Email', u.Email
               ) AS User,
               JSON_OBJECT(
                       'Product_ID', p.Product_ID,
                       'Name', p.Name,
                       'Barcode', p.Barcode,
                       'Category', c.Name
               ) AS Product
        FROM Requests r
                 LEFT JOIN Users u ON r.User_ID = u.User_ID
                 LEFT JOIN Products p ON r.Product_ID = p.Product_ID
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows.map(row => ({
        Request_ID: row.Request_ID,
        Quantity: row.Quantity,
        Request_Date: row.Request_Date,
        Route_ID: row.Route_ID,
        Processed: row.Processed,
        Processed_Date: row.Processed_Date,
        User: typeof row.User === 'string' ? JSON.parse(row.User) : row.User,
        Product: typeof row.Product === 'string' ? JSON.parse(row.Product) : row.Product
    }));
}

// Update a request by ID
async function updateOne(id, data) {
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }
    const connection = await getConnection();
    const fields = Object.keys(data).map(field => `${field} = ?`).join(", ");
    const values = Object.values(data);
    const query = `
        UPDATE Requests
        SET ${fields}
        WHERE Request_ID = ?
    `;
    values.push(id);
    const [result] = await connection.execute(query, values);
    await connection.end();

    if (result.affectedRows === 0) {
        throw new Error(`Request with Request_ID ${id} does not exist`);
    }

    return { Request_ID: id, ...data };
}

// Delete a request by ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Requests WHERE Request_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getAll, getOneBy, updateOne, deleteOne, getAllWithoutRoute };
