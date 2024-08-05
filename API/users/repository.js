const getConnection = require("../common/db_handler");

// Création d'un utilisateur classique
async function createOne(user) {
    const connection = await getConnection();
    const [result] = await connection.execute(
        'INSERT INTO Users (Name, Firstname, Address_ID, Phone, Email, Password, Birthdate, Current_Subscription) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user.name, user.firstname, user.address_id, user.phone, user.email, user.password, user.birthdate, user.current_subscription]
    );
    await connection.end();
    return result.insertId;
}

// Récupère un utilisateur en fonction de son ID
async function getOne(id) {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Users WHERE User_ID = ?', [id]);
    await connection.end();
    return rows[0] || null;
}

async function checkPassword(id, password) {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Users WHERE User_ID = ? AND Password = ?', [id, password]);
    await connection.end();
    return rows[0] || null;
}

// Récupère un ou plusieurs utilisateurs en fonction d'un attribut
async function getOneBy(attribute, value) {
    const connection = await getConnection();
    const [rows] = await connection.execute(`SELECT * FROM Users WHERE ${attribute} = ?`, [value]);
    await connection.end();
    return rows[0] || null;
}

// Récupère tous les utilisateurs
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Users');
    await connection.end();
    return rows;
}

// Update un utilisateur
async function updateOne(id, user) {
    const connection = await getConnection();
    const attrsStr = Object.keys(user)
        .map((k) => `${k} = ?`)
        .join(', ');

    const values = [...Object.values(user), id];
    const [result] = await connection.execute(
        `UPDATE Users SET ${attrsStr} WHERE User_ID = ?`,
        values
    );
    await connection.end();
    return result.affectedRows > 0;
}

// Supprime un utilisateur par son ID
async function deleteOne(id) {
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Users WHERE User_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = {createOne, getOne, getAll, updateOne, deleteOne, getOneBy, checkPassword};
