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
                 LEFT JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 LEFT JOIN Users u_recipient ON d.Recipient_User_ID = u_recipient.User_ID
                 LEFT JOIN Products p ON d.Product_ID = p.Product_ID
        WHERE d.Donor_User_ID = ?
    `;

    const [rows] = await connection.execute(query, [donorUserId]);
    console.log("Donations found: ", rows);
    await connection.end();
    return rows.length > 0 ? rows : [];
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


// Récupère tous les utilisateurs avec la date de la donation
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT d.Donation_ID,
               d.Quantity,
               d.Date AS Donation_Date,
               d.Donor_User_ID,
               d.Recipient_User_ID,
               JSON_OBJECT(
                       'User_ID', u_donor.User_ID,
                       'Email', u_donor.Email
               )       AS Donor_User,
               IF(d.Recipient_User_ID IS NOT NULL, JSON_OBJECT(
                       'User_ID', u_recipient.User_ID,
                       'Email', u_recipient.Email
                                                   ), NULL) AS Recipient_User,
               JSON_OBJECT(
                       'Product_ID', p.Product_ID,
                       'Name', p.Name,
                       'Storage_Type', p.Storage_Type
               )       AS Product
        FROM Donations d
                 LEFT JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 LEFT JOIN Users u_recipient ON d.Recipient_User_ID = u_recipient.User_ID
                 LEFT JOIN Products p ON d.Product_ID = p.Product_ID
        WHERE d.Recipient_User_ID IS NULL
           OR u_recipient.User_ID IS NOT NULL
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows.map(row => ({
        Donation_ID: row.Donation_ID,
        Quantity: row.Quantity,
        Donation_Date: row.Donation_Date,
        Donor_User: typeof row.Donor_User === 'string' ? JSON.parse(row.Donor_User) : row.Donor_User,
        Recipient_User: row.Recipient_User ? (typeof row.Recipient_User === 'string' ? JSON.parse(row.Recipient_User) : row.Recipient_User) : null,
        Product: typeof row.Product === 'string' ? JSON.parse(row.Product) : row.Product
    }));
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
    const [result] = await connection.execute('DELETE FROM Donations WHERE Product_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = {createOne, getAll, getOne, updateOne, deleteOne, getOneBy};
