const getConnection = require("../common/db_handler");

// Création d'un enregistrement de stock
async function createOne(stock) {
    if (!stock.Product_ID || !stock.Quantity) {
        throw new Error("createOne: Product_ID and Quantity must be defined");
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const query = `
            INSERT INTO Stocks (Product_ID, Quantity)
            VALUES (?, ?)
        `;
        const [result] = await connection.execute(query, [stock.Product_ID, stock.Quantity]);

        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

// Récupère un stock par son ID
async function getOne(id) {
    if (!id) {
        throw new Error("getOne: ID must be defined");
    }

    const connection = await getConnection();
    const query = `
        SELECT s.*, p.*, c.Name AS Category_Name, c.StorageSector
        FROM Stocks s
                 JOIN Products p ON s.Product_ID = p.Product_ID
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
        WHERE s.Stock_ID = ?
    `;
    const [rows] = await connection.execute(query, [id]);
    await connection.end();
    return rows.length ? rows[0] : null;
}

// Récupère un ou plusieurs stocks en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }

    const connection = await getConnection();
    console.log(`Searching by ${attribute}: ${value}`);
    const query = `
        SELECT s.*, p.*, c.Name AS Category_Name, c.StorageSector
        FROM Stocks s
                 JOIN Products p ON s.Product_ID = p.Product_ID
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
        WHERE s.${attribute} = ?
    `;
    const [rows] = await connection.execute(query, [value]);
    console.log("Produit trouvé: ", rows);
    await connection.end();
    return rows || null;
}

async function getAllStockIDs() { // Renamed to clarify it's for IDs
    const connection = await getConnection(); // Assumes `getConnection` provides a DB connection
    const query = `
        SELECT Product_ID
        FROM Stocks
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows.map(row => row.Product_ID); // Extract only the IDs
}

// Récupère tous les stocks
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT s.*, p.*, c.Name AS Category_Name, c.StorageSector
        FROM Stocks s
                 JOIN Products p ON s.Product_ID = p.Product_ID
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows;
}

// Update un enregistrement de stock
async function updateOne(id, quantity) {
    if (id === undefined || quantity === undefined) {
        throw new Error("updateOne: id and quantity must be defined");
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
        'UPDATE Stocks SET Quantity = ? WHERE Product_ID = ?',
        [quantity, id]
    );
    await connection.end();
    return result.affectedRows > 0;
}

// Supprime un enregistrement de stock par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Stocks WHERE Product_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getAll, getAllStockIDs, getOne, updateOne, deleteOne, getOneBy };
