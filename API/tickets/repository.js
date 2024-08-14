const getConnection = require("../common/db_handler");

// Création d'un ticket
async function createOne(ticket) {
    const connection = await getConnection();
    const [result] = await connection.execute(
        `INSERT INTO Tickets 
        (Title, Direction, Category_ID, Start_Date, Duration, Places, Tools, Address_ID, Address_Needs, Customers_Address, Description, Image, Status_ID, Owner_User_ID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            ticket.title, ticket.direction, ticket.category_id, ticket.start_date, ticket.duration, ticket.places,
            ticket.tools, ticket.address_id, ticket.address_needs, ticket.customers_address, ticket.description,
            ticket.image, ticket.status_id, ticket.owner_id
        ]
    );
    await connection.end();
    return result.insertId;
}

// Récupère un ticket par son ID
async function getOne(id) {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM tickets WHERE Ticket_ID = ?', [id]);
    await connection.end();
    return rows[0] || null;
}

// Récupère tous les tickets
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM tickets');
    await connection.end();
    return rows;
}

// Mise à jour d'un ticket par son ID
async function updateOne(id, ticket) {
    const connection = await getConnection();
    const attrsStr = Object.keys(ticket)
        .map((k) => `${k} = ?`)
        .join(', ');

    const values = [...Object.values(ticket), id];
    const [result] = await connection.execute(
        `UPDATE Tickets SET ${attrsStr} WHERE Ticket_ID = ?`,
        values
    );
    await connection.end();
    return result.affectedRows > 0;
}

// Suppression d'un ticket par son ID
async function deleteOne(id) {
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM tickets WHERE Ticket_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
