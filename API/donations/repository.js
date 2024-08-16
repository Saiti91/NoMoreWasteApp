const getConnection = require("../common/db_handler");

// Création d'une donation
async function createOne(donation) {
    if (!donation) {
        throw new Error("createOne: donation object must be defined");
    }
    const connection = await getConnection();
    const query = `
        INSERT INTO Donations (Product_ID, Quantity, Donor_User_ID, Date)
        VALUES (?, ?, ?, ?)
    `;
    const values = [donation.Product_ID, donation.Quantity, donation.Donor_User_ID, donation.Date];
    const [result] = await connection.execute(query, values);
    await connection.end();
    return { Donation_ID: result.insertId, ...donation };
}

async function getDonationsBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getDonationsBy: Both attribute and value must be defined");
    }
    const connection = await getConnection();
    console.log(`Searching for donations by ${attribute}: ${value}`);

    const query = `
        SELECT d.*,
               u_donor.User_ID       AS Donor_User_ID,
               u_donor.Name          AS Donor_Name,
               u_donor.Firstname     AS Donor_Firstname,
               u_donor.Email         AS Donor_Email,
               p.*
        FROM Donations d
                 LEFT JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 LEFT JOIN Products p ON d.Product_ID = p.Product_ID
        WHERE d.${attribute} = ?
    `;

    const [rows] = await connection.execute(query, [value]);
    console.log("Donations found: ", rows);
    await connection.end();
    return rows.length > 0 ? rows : [];
}

// Récupère toutes les donations avec les détails du donneur
async function getAll() {
    const connection = await getConnection();
    const query = `
        SELECT d.Donation_ID,
               d.Quantity,
               d.Date AS Donation_Date,
               d.Donor_User_ID,
               JSON_OBJECT(
                       'User_ID', u_donor.User_ID,
                       'Email', u_donor.Email
               )       AS Donor_User,
               JSON_OBJECT(
                       'Product_ID', p.Product_ID,
                       'Name', p.Name,
                       'Storage_Type', p.Storage_Type
               )       AS Product
        FROM Donations d
                 LEFT JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 LEFT JOIN Products p ON d.Product_ID = p.Product_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows.map(row => ({
        Donation_ID: row.Donation_ID,
        Quantity: row.Quantity,
        Donation_Date: row.Donation_Date,
        Donor_User: typeof row.Donor_User === 'string' ? JSON.parse(row.Donor_User) : row.Donor_User,
        Product: typeof row.Product === 'string' ? JSON.parse(row.Product) : row.Product
    }));
}

// Met à jour une donation par son ID
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
        WHERE Donation_ID = ?
    `;
    values.push(id);
    const [result] = await connection.execute(query, values);
    await connection.end();

    if (result.affectedRows === 0) {
        throw new Error(`Donation with Donation_ID ${id} does not exist`);
    }

    return { Donation_ID: id, ...data };
}

// Supprime une donation par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Donations WHERE Donation_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getAll, getDonationsBy, updateOne, deleteOne };
