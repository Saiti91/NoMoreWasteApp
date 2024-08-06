const getConnection = require("../common/db_handler");

// Création d'un utilisateur classique
async function createOne(user) {
    const {
        name = null,
        firstname = null,
        address_id = null,
        phone = null,
        email = null,
        password = null,
        birthdate = null,
        current_subscription = null
    } = user;

    const connection = await getConnection();
    const [result] = await connection.execute(
        'INSERT INTO Users (Name, Firstname, Address_ID, Phone, Email, Password, Birthdate, Current_Subscription) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, firstname, address_id, phone, email, password, birthdate, current_subscription]
    );
    await connection.end();
    return result.insertId;
}

// Récupère un utilisateur en fonction de son ID
async function getOne(id) {
    if (id === undefined) {
        throw new Error("getOne: id must be defined");
    }
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Users WHERE User_ID = ?', [id]);
    await connection.end();
    return rows[0] || null;
}

async function checkPassword(id, password) {
    if (id === undefined || password === undefined) {
        throw new Error("checkPassword: Both id and password must be defined");
    }
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Users WHERE User_ID = ? AND Password = ?', [id, password]);
    await connection.end();
    return rows[0] || null;
}

// Récupère un ou plusieurs utilisateurs en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const connection = await getConnection();
    console.log(`Searching by ${attribute}: ${value}`);
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
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }
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
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Users WHERE User_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = {createOne, getOne, getAll, updateOne, deleteOne, getOneBy, checkPassword};
