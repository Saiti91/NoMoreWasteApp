const getConnection = require("../common/db_handler");

// Créer une nouvelle adresse
async function createOne(address) {
    const connection = await getConnection();
    try {
        const [result] = await connection.execute(
            'INSERT INTO Address (Street, City, State, Postal_Code, Country) VALUES (?, ?, ?, ?, ?)',
            [address.street, address.city, address.state, address.postal_code, address.country]
        );
        return { Address_ID: result.insertId, ...address };
    } finally {
        await connection.end();
    }
}

// Récupérer une adresse par ID
async function getOne(id) {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Address WHERE Address_ID = ?', [id]);
    await connection.end();
    return rows[0] || null;
}

// Récupérer toutes les adresses
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Address');
    await connection.end();
    return rows;
}

// Mettre à jour une adresse
async function updateOne(id, address) {
    const connection = await getConnection();
    const fields = Object.keys(address).map(key => `${key} = ?`).join(', ');
    const values = Object.values(address);

    const [result] = await connection.execute(
        `UPDATE Address SET ${fields} WHERE Address_ID = ?`,
        [...values, id]
    );
    await connection.end();
    return result.affectedRows > 0;
}

// Supprimer une adresse par ID
async function deleteOne(id) {
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Address WHERE Address_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne
};
