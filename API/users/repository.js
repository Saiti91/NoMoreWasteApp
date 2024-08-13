const getConnection = require("../common/db_handler");

// Création d'un utilisateur classique
async function createOne(user) {
    console.log('User in repository : ',user)
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
    const [rows] = await connection.execute(`SELECT *
                                             FROM Users
                                             WHERE ${attribute} = ?`, [value]);
    await connection.end();
    return rows[0] || null;
}

async function getOneVerifBy(attribute, value, id) {
    if (attribute === undefined || value === undefined || id === undefined) {
        throw new Error("getOneVerifBy: Attribute, value, and id must be defined");
    }

    const connection = await getConnection();
    const query = `SELECT *
                   FROM Users
                   WHERE ${attribute} = ?
                     AND User_ID = ?`;
    const [rows] = await connection.execute(query, [value, id]);
    await connection.end();
    return rows[0] || null;
}

async function verifySkill(User_id, skillName) {
    if (User_id === undefined || skillName === undefined) {
        throw new Error("verifySkill: Both User_id and skillName must be defined");
    }
    const connection = await getConnection();
    try {
        const [skillRows] = await connection.execute(`SELECT Skill_ID
                                                      FROM Skills
                                                      WHERE Name = ?`, [skillName]);
        if (skillRows.length === 0) {
            throw new Error(`Skill "${skillName}" not found`);
        }
        const skillId = skillRows[0].Skill_ID;
        const [userSkillRows] = await connection.execute(`SELECT *
                                                          FROM User_Skills
                                                          WHERE User_ID = ?
                                                            AND Skill_ID = ?`, [User_id, skillId]);
        return userSkillRows[0] || null;
    } finally {
        await connection.end();
    }
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
        `UPDATE Users
         SET ${attrsStr}
         WHERE User_ID = ?`,
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

module.exports = {createOne, getOne, getOneVerifBy, verifySkill, getAll, updateOne, deleteOne, getOneBy, checkPassword};
