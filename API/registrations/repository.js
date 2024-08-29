const getConnection = require("../common/db_handler");

// Création d'une nouvelle inscription pour un utilisateur à un ticket
async function createOne(ticketId, userId) {
    if (ticketId === undefined || userId === undefined) {
        throw new Error("createOne: ticketId and userId must be defined");
    }

    const connection = await getConnection();

    try {
        const [result] = await connection.execute(
            'INSERT INTO Ticket_Users (Ticket_ID, User_ID) VALUES (?, ?)',
            [ticketId, userId]
        );
        await connection.end();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.end();
        console.error("Error creating registration:", error);
        throw error;
    }
}

// Suppression d'une inscription pour un utilisateur à un ticket
async function deleteOne(ticketId, userId) {
    if (ticketId === undefined || userId === undefined) {
        throw new Error("deleteOne: ticketId and userId must be defined");
    }

    const connection = await getConnection();

    try {
        const [result] = await connection.execute(
            'DELETE FROM Ticket_Users WHERE Ticket_ID = ? AND User_ID = ?',
            [ticketId, userId]
        );
        await connection.end();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.end();
        console.error("Error deleting registration:", error);
        throw error;
    }
}

// Récupérer toutes les inscriptions
async function getAll() {
    const connection = await getConnection();

    try {
        const [rows] = await connection.execute('SELECT * FROM Ticket_Users');
        await connection.end();
        return rows;
    } catch (error) {
        await connection.end();
        console.error("Error retrieving all registrations:", error);
        throw error;
    }
}

// Récupérer toutes les inscriptions pour un ticket particulier
async function getAllForTicket(ticketId) {
    if (ticketId === undefined) {
        throw new Error("getAllForTicket: ticketId must be defined");
    }

    const connection = await getConnection();

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM Ticket_Users WHERE Ticket_ID = ?',
            [ticketId]
        );
        await connection.end();
        return rows;
    } catch (error) {
        await connection.end();
        console.error("Error retrieving registrations for ticket:", error);
        throw error;
    }
}

// Récupérer toutes les inscriptions pour un utilisateur particulier
async function getAllForUser(userId) {
    if (userId === undefined) {
        throw new Error("getAllForUser: userId must be defined");
    }

    const connection = await getConnection();

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM Ticket_Users WHERE User_ID = ?',
            [userId]
        );
        await connection.end();
        return rows;
    } catch (error) {
        await connection.end();
        console.error("Error retrieving registrations for user:", error);
        throw error;
    }
}

module.exports = {
    createOne,
    deleteOne,
    getAll,
    getAllForTicket,
    getAllForUser,
};
