const getConnection = require("../common/db_handler");

// Création d'un utilisateur classique
async function createOne(stock) {

}

async function getOne(id) {

}

// Récupère un ou plusieurs utilisateurs en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const connection = await getConnection();
    console.log(`Searching by ${attribute}: ${value}`);
    const query = `
        SELECT s.*, p.*
        FROM Stocks s
        JOIN Products p ON s.Product_ID = p.Product_ID
        WHERE s.${attribute} = ?
    `;
    const [rows] = await connection.execute(query, [value]);
    await connection.end();
    return rows || null;
}

// Récupère tous les utilisateurs
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT s.*, p.*
        FROM Stocks s
        JOIN Products p ON s.Product_ID = p.Product_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows;
}

// Update un utilisateur
async function updateOne(id, quantity, storageDate) {
    if (id === undefined || quantity === undefined) {
        throw new Error("updateOne: id and quantity must be defined");
    }

    // Utiliser la date actuelle si storageDate n'est pas défini
    if (storageDate === undefined) {
        storageDate = new Date().toISOString().split('T')[0];
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
        'UPDATE Stocks SET Quantity = ?, Storage_Date = ? WHERE Product_ID = ?',
        [quantity, storageDate, id]
    );
    await connection.end();
    return result.affectedRows > 0;
}

// Supprime un utilisateur par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Stocks WHERE Product_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = {createOne, getAll,getOne, updateOne, deleteOne, getOneBy};
