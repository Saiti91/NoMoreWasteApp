const getConnection = require("../common/db_handler");

// Création d'une donation
async function createOne(donation) {
    if (!donation) {
        throw new Error("createOne: donation object must be defined");
    }
    const connection = await getConnection();
    const query = `
        INSERT INTO Donations (Product_ID, Quantity, Donor_User_ID, Date, Route_ID, Collected, Collection_Date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        donation.Product_ID,
        donation.Quantity,
        donation.Donor_User_ID,
        donation.Date,
        donation.Route_ID || null,  // Allow NULL if Route_ID is not provided
        donation.Collected || false, // Default to false if not provided
        donation.Collection_Date || null // Allow NULL if Collection_Date is not provided
    ];
    const [result] = await connection.execute(query, values);
    await connection.end();
    return { Donation_ID: result.insertId, ...donation };
}

// Récupère les donations par un attribut spécifique
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
               p.*,
               r.Route_ID            AS Route_ID,
               r.Date                AS Route_Date
        FROM Donations d
                 LEFT JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 LEFT JOIN Products p ON d.Product_ID = p.Product_ID
                 LEFT JOIN Routes r ON d.Route_ID = r.Route_ID
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
               d.Route_ID,
               d.Collected,
               d.Collection_Date,
               JSON_OBJECT(
                       'User_ID', u_donor.User_ID,
                       'Email', u_donor.Email
               )       AS Donor_User,
               JSON_OBJECT(
                       'Product_ID', p.Product_ID,
                       'Name', p.Name,
                       'Storage_Type', p.Storage_Type
               )       AS Product,
               JSON_OBJECT(
                       'Route_ID', r.Route_ID,
                       'Date', r.Date
               )       AS Route
        FROM Donations d
                 LEFT JOIN Users u_donor ON d.Donor_User_ID = u_donor.User_ID
                 LEFT JOIN Products p ON d.Product_ID = p.Product_ID
                 LEFT JOIN Routes r ON d.Route_ID = r.Route_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows.map(row => ({
        Donation_ID: row.Donation_ID,
        Quantity: row.Quantity,
        Donation_Date: row.Donation_Date,
        Donor_User: typeof row.Donor_User === 'string' ? JSON.parse(row.Donor_User) : row.Donor_User,
        Product: typeof row.Product === 'string' ? JSON.parse(row.Product) : row.Product,
        Route: typeof row.Route === 'string' ? JSON.parse(row.Route) : row.Route,
        Collected: row.Collected,
        Collection_Date: row.Collection_Date
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
