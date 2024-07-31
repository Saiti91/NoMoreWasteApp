const db = require("../common/db_handler");

// Création d'un utilisateur classique
async function createUser(user) {
    //TODO
}

// Récupère un utilisateur en fonction de son ID
async function getOne(id) {
    return await db.oneOrNone("SELECT * FROM users WHERE users_id=${id}", {id});
}

async function checkPassword(id, password) {
    return await db.oneOrNone("SELECT * FROM users WHERE users_id=${id} AND password=${password}", {id, password});
}

// Récupère un ou plusieurs utilisateurs en fonction d'un attribut
async function getOneBy(attribute, value) {
    const res = await db.oneOrNone(
        `SELECT *
         FROM users
         WHERE ${attribute} = $1`, [value]
    );
    console.log(res);
    return res || null;
}

// Récupère tous les utilisateurs
async function getAll() {
    const res = await db.manyOrNone("SELECT * FROM users");
    return res || [];
}

// Update un utilisateur
async function updateOne(id, user) {
    const attrsStr = Object.keys(user)
        .map((k) => ` ${k} = $<${k}> `)
        .join(",");

    return await db.oneOrNone(
        `UPDATE users
         SET ${attrsStr}
         WHERE users_id = ${id}
         RETURNING *;`,
        {id, ...user}
    );
}

// Supprime un utilisateur par son ID
async function deleteOne(id) {
    return await db.oneOrNone("DELETE FROM users WHERE users_id=${id} RETURNING users_id;", {id});
}

module.exports = {createOne, getOne, getAll, updateOne, deleteOne, getOneBy, createProvider, checkPassword};
