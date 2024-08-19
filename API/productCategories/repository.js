const getConnection = require("../common/db_handler");

// Création d'une catégorie de produit
async function createOne(category) {
    if (!category.Name) {
        throw new Error("createOne: Name must be defined");
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const query = `
            INSERT INTO ProductsCategories (Name, StorageSector)
            VALUES (?, ?)
        `;
        const [result] = await connection.execute(query, [category.Name, category.StorageSector]);

        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

// Récupère une catégorie par son ID
async function getOne(id) {
    if (!id) {
        throw new Error("getOne: ID must be defined");
    }

    const connection = await getConnection();
    const query = `
        SELECT *
        FROM ProductsCategories
        WHERE Category_ID = ?
    `;
    const [rows] = await connection.execute(query, [id]);
    await connection.end();
    return rows.length ? rows[0] : null;
}

// Récupère une ou plusieurs catégories en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }

    const connection = await getConnection();
    console.log(`Searching by ${attribute}: ${value}`);
    const query = `
        SELECT *
        FROM ProductsCategories
        WHERE ${attribute} = ?
    `;
    const [rows] = await connection.execute(query, [value]);
    console.log("Category found: ", rows);
    await connection.end();
    return rows.length ? rows[0] : null;
}

// Récupère toutes les catégories de produits
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT *
        FROM ProductsCategories
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows;
}

// Update un enregistrement de catégorie de produit
async function updateOne(id, category) {
    if (!id || !category) {
        throw new Error("updateOne: ID and category data must be defined");
    }

    const connection = await getConnection();
    const fields = Object.keys(category).map(key => `${key} = ?`).join(", ");
    const values = Object.values(category);
    values.push(id);

    const query = `
        UPDATE ProductsCategories
        SET ${fields}
        WHERE Category_ID = ?
    `;
    const [result] = await connection.execute(query, values);
    await connection.end();
    return result.affectedRows > 0;
}

// Supprime un enregistrement de catégorie de produit par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: ID must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM ProductsCategories WHERE Category_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getAll, getOne, updateOne, deleteOne, getOneBy };
