const getConnection = require('../common/db_handler');

// Crée un nouveau diplôme
async function createOne(diploma) {
    const { name } = diploma;

    if (name === undefined) {
        throw new Error("createOne: name must be defined");
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
        'INSERT INTO Diplomas (Name) VALUES (?)',
        [name]
    );
    await connection.end();
    return result.insertId;
}

// Récupère un diplôme en fonction de son ID
async function getOne(id) {
    if (id === undefined) {
        throw new Error("getOne: id must be defined");
    }

    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Diplomas WHERE Diploma_ID = ?', [id]);
    await connection.end();
    return rows[0] || null;
}

// Récupère tous les diplômes
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Diplomas');
    await connection.end();
    return rows;
}

// Met à jour un diplôme
async function updateOne(id, diploma) {
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }

    const connection = await getConnection();
    const attrsStr = Object.keys(diploma)
        .map((k) => `${k} = ?`)
        .join(', ');

    const values = [...Object.values(diploma), id];
    const [result] = await connection.execute(
        `UPDATE Diplomas SET ${attrsStr} WHERE Diploma_ID = ?`,
        values
    );
    await connection.end();
    return result.affectedRows > 0;
}

// Supprime un diplôme par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }

    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Diplomas WHERE Diploma_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
