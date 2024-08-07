const getConnection = require("../common/db_handler");

// Création d'un utilisateur classique
async function createOne(stock) {

}

async function getOne(donorUserId) {
    if (donorUserId === undefined) {
        throw new Error("getOne: donorUserId must be defined");
    }
    const connection = await getConnection();
    console.log(`Searching for donations by Donor_User_ID: ${donorUserId}`);
    const query = `
        SELECT d.*,
               u_donor.User_ID       AS Donor_User_ID,
               u_donor.Name          AS Donor_Name,
               u_donor.Firstname     AS Donor_Firstname,
               u_donor.Email         AS Donor_Email,
               u_recipient.User_ID   AS Recipient_User_ID,
               u_recipient.Name      AS Recipient_Name,
               u_recipient.Firstname AS Recipient_Firstname,
               u_recipient.Email     AS Recipient_Email,
               p.*
        FROM Donations d
                 JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 JOIN Users u_recipient ON d.Recipient_User_ID = u_recipient.User_ID
                 JOIN Products p ON d.Product_ID = p.Product_ID
        WHERE d.Donor_User_ID = ?
    `;
    const [rows] = await connection.execute(query, [donorUserId]);
    await connection.end();
    return rows || null;
}

// Récupère un ou plusieurs utilisateurs en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const connection = await getConnection();
    console.log(`Searching by ${attribute}: ${value}`);
    const query = `
        SELECT d.*,
               u_donor.User_ID       AS Donor_User_ID,
               u_donor.Name          AS Donor_Name,
               u_donor.Firstname     AS Donor_Firstname,
               u_donor.Email         AS Donor_Email,
               u_recipient.User_ID   AS Recipient_User_ID,
               u_recipient.Name      AS Recipient_Name,
               u_recipient.Firstname AS Recipient_Firstname,
               u_recipient.Email     AS Recipient_Email,
               p.*
        FROM Donations d
                 JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 JOIN Users u_recipient ON d.Recipient_User_ID = u_recipient.User_ID
                 JOIN Products p ON d.Product_ID = p.Product_ID
        WHERE d.${attribute} = ?
    `;
    const [rows] = await connection.execute(query, [value]);
    await connection.end();
    return rows || null;
}


// Récupère tous les utilisateurs
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT d.*,
               u_donor.*,
               u_recipient.*,
               p.*
        FROM Donations d
                 JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 JOIN Users u_recipient ON d.Recipient_User_ID = u_recipient.User_ID
                 JOIN Products p ON d.Product_ID = p.Product_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows;
}


// Update un utilisateur
async function updateOne(id, data) {
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }
    const connection = await getConnection();
    // Construction de la partie SET de la requête SQL
    const fields = Object.keys(data).map(field => `${field} = ?`).join(", ");
    const values = Object.values(data);
    const query = `
        UPDATE Donations
        SET ${fields}
        WHERE Product_ID = ?
    `;
    values.push(id);
    const [result] = await connection.execute(query, values);
    await connection.end();

    if (result.affectedRows === 0) {
        throw new Error(`Donation with Product_ID ${id} does not exist`);
    }

    return {Product_ID: id, ...data};
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

module.exports = {createOne, getAll, getOne, updateOne, deleteOne, getOneBy};
