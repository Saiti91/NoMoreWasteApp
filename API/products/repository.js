const getConnection = require("../common/db_handler");

// Création d'un enregistrement de produit
async function createOne(product) {
    if (!product.Barcode || !product.Name || !product.Category_ID) {
        throw new Error("createOne: Barcode, Name, and Category_ID must be defined");
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const query = `
            INSERT INTO Products (Barcode, Name, Category_ID)
            VALUES (?, ?, ?)
        `;
        const [result] = await connection.execute(query, [product.Barcode, product.Name, product.Category_ID]);

        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

// Récupère un produit par son ID
async function getOne(id) {
    if (!id) {
        throw new Error("getOne: ID must be defined");
    }

    const connection = await getConnection();
    const query = `
        SELECT p.*, c.Name AS Category_Name, c.StorageSector
        FROM Products p
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
        WHERE p.Product_ID = ?
    `;
    const [rows] = await connection.execute(query, [id]);
    await connection.end();
    return rows.length ? rows[0] : null;
}

// Récupère un ou plusieurs produits en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }

    const connection = await getConnection();
    console.log(`Searching by ${attribute}: ${value}`);
    const query = `
        SELECT p.*, c.Name AS Category_Name, c.StorageSector
        FROM Products p
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
        WHERE p.${attribute} = ?
    `;
    const [rows] = await connection.execute(query, [value]);
    console.log("Produit trouvé: ", rows);
    await connection.end();
    return rows || null;
}

// Récupère tous les produits
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT p.*, c.Name AS Category_Name, c.StorageSector
        FROM Products p
                 LEFT JOIN ProductsCategories c ON p.Category_ID = c.Category_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows;
}

// Update un enregistrement de produit
async function updateOne(id, product) {
    if (!id || !product) {
        throw new Error("updateOne: ID and product data must be defined");
    }

    const connection = await getConnection();
    const fields = Object.keys(product).map(key => `${key} = ?`).join(", ");
    const values = Object.values(product);
    values.push(id);

    const query = `
        UPDATE Products
        SET ${fields}
        WHERE Product_ID = ?
    `;
    const [result] = await connection.execute(query, values);
    await connection.end();
    return result.affectedRows > 0;
}

// Supprime un enregistrement de produit par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: ID must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Products WHERE Product_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getAll, getOne, updateOne, deleteOne, getOneBy };
