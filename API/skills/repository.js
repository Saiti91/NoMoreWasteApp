const getConnection = require("../common/db_handler");


// Fonction pour créer une nouvelle compétence
async function createOne(skill) {
    const connection = await getConnection();
    const { Name } = skill;

    const [result] = await connection.execute(
        'INSERT INTO Skills (Name) VALUES (?)',
        [Name]
    );

    await connection.end();
    return result.insertId;
}

// Fonction pour récupérer une compétence par son ID
async function getOne(id) {
    const connection = await getConnection();

    const [rows] = await connection.execute(
        'SELECT * FROM Skills WHERE Skill_ID = ?',
        [id]
    );

    await connection.end();
    return rows.length > 0 ? rows[0] : null;
}

// Fonction pour récupérer toutes les compétences
async function getAll() {
    const connection = await getConnection();

    const [rows] = await connection.execute(
        'SELECT * FROM Skills'
    );

    await connection.end();
    return rows;
}

// Fonction pour récupérer toutes les compétences validées d'un utilisateur
async function getAllForUser(userId) {
    const connection = await getConnection();

    const [rows] = await connection.execute(
        `SELECT Skills.Skill_ID, Skills.Name, User_Skills.Validation_Date, User_Skills.Document_Path
         FROM User_Skills
         JOIN Skills ON User_Skills.Skill_ID = Skills.Skill_ID
         WHERE User_Skills.User_ID = ?`,
        [userId]
    );

    await connection.end();
    return rows;
}

//Fonction pour supprimer une compétence d'un utilisateur
async function deleteSkillForUser(userId, skillId) {
    const connection = await getConnection();

    // Supprimer la compétence pour l'utilisateur s'il existe
    const [result] = await connection.execute(
        `DELETE FROM User_Skills WHERE User_ID = ? AND Skill_ID = ?`,
        [userId, skillId]
    );

    await connection.end();

    // Vérifiez si une ligne a été affectée (donc si la compétence a été supprimée)
    if (result.affectedRows === 0) {
        throw new NotFoundError("Skill not found for this user");
    }

    return result;
}


// Fonction pour vérifier si un utilisateur possède une compétence spécifique
async function verifySkill(userId, skillName) {
    const connection = await getConnection();

    const [rows] = await connection.execute(
        `SELECT User_Skills.User_ID, User_Skills.Skill_ID, User_Skills.Validation_Date, User_Skills.Document_Path
         FROM User_Skills
         JOIN Skills ON User_Skills.Skill_ID = Skills.Skill_ID
         WHERE User_Skills.User_ID = ? AND Skills.Name = ?`,
        [userId, skillName]
    );

    await connection.end();
    return rows.length > 0 ? rows[0] : null;
}

// Fonction pour mettre à jour une compétence par son ID
async function updateOne(id, skill) {
    const connection = await getConnection();
    const { Name } = skill;

    const [result] = await connection.execute(
        'UPDATE Skills SET Name = ? WHERE Skill_ID = ?',
        [Name, id]
    );

    await connection.end();
    return result.affectedRows > 0;
}

// Fonction pour supprimer une compétence par son ID
async function deleteOne(id) {
    const connection = await getConnection();

    const [result] = await connection.execute(
        'DELETE FROM Skills WHERE Skill_ID = ?',
        [id]
    );

    await connection.end();
    return result.affectedRows > 0;
}

// Fonction pour vérifier si une compétence avec un attribut spécifique existe
async function getOneBy(attribute, value) {
    const connection = await getConnection();

    const [rows] = await connection.execute(
        `SELECT * FROM Skills WHERE ${attribute} = ?`,
        [value]
    );

    await connection.end();
    return rows.length > 0 ? rows[0] : null;
}

module.exports = {
    createOne,
    getOne,
    getAll,
    getAllForUser,
    verifySkill,
    updateOne,
    deleteOne,
    getOneBy,
    deleteSkillForUser
};
