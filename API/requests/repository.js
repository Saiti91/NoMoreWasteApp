const getConnection = require("../common/db_handler");

// Create a new request
async function createOne(request) {
    if (!request) {
        throw new Error("createOne: request object must be defined");
    }
    const connection = await getConnection();
    const query = `
        INSERT INTO Requests (Product_ID, Quantity, Date, User_ID)
        VALUES (?, ?, ?, ?)
    `;
    const values = [request.Product_ID, request.Quantity, request.Date, request.User_ID];
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
        SELECT r.*,
               u.User_ID,
               u.Name AS User_Name,
               u.Firstname AS User_Firstname,
               u.Email AS User_Email,
               p.Product_ID,
               p.Name AS Product_Name,
               p.Barcode,
               c.Name AS Category_Name
        FROM Requests r
                 LEFT JOIN Users u ON r.User_ID = u.User_ID
                 LEFT JOIN Products p ON r.Product_ID = p.Product_ID
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
        WHERE r.${attribute} = ?
    `;
    const [rows] = await connection.execute(query, [value]);
    await connection.end();
    return rows.length > 0 ? rows : null;
}

// Get all requests
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT r.Request_ID,
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

module.exports = { createOne, getAll, getOneBy, updateOne, deleteOne };
