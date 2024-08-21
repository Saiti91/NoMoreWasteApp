const getConnection = require('../common/db_handler');

// Crée une nouvelle catégorie
async function createOne(SkillsCategories) {
    const {
        name,
        diploma_id
    } = SkillsCategories;

    if (name === undefined || diploma_id === undefined) {
        throw new Error("createOne: name and diploma_id must be defined");
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
        'INSERT INTO SkillsCategories (Name, Diploma_ID) VALUES (?, ?)',
        [name, diploma_id]
    );
    await connection.end();
    return result.insertId;
}

// Récupère une catégorie en fonction de son ID
async function getOne(id) {
    if (id === undefined) {
        throw new Error("getOne: id must be defined");
    }

    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM SkillsCategories WHERE Category_ID = ?', [id]);
    await connection.end();
    return rows[0] || null;
}

// Récupère toutes les catégories
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM SkillsCategories');
    await connection.end();
    return rows;
}

// Met à jour une catégorie
async function updateOne(id, SkillsCategories) {
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }

    const connection = await getConnection();
    const attrsStr = Object.keys(SkillsCategories)
        .map((k) => `${k} = ?`)
        .join(', ');

    const values = [...Object.values(SkillsCategories), id];
    const [result] = await connection.execute(
        `UPDATE Categories SET ${attrsStr} WHERE Category_ID = ?`,
        values
    );
    await connection.end();
    return result.affectedRows > 0;
}

// Supprime une catégorie par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }

    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM SkillsCategories WHERE Category_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
