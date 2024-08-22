const getConnection = require('../common/db_handler');

// Création d'un ticket
async function createOne(ticket) {
    const {
        title,
        propose,
        category,
        startDate,
        startTime,
        duration,
        format,
        places,
        tools,
        toolsOther,
        extraTools,
        address,
        needsCustomerAddress,
        description,
        image
    } = ticket;

    const connection = await getConnection();
    const [result] = await connection.execute(
        'INSERT INTO Tickets (Title, Propose, Category, Start_Date, Start_Time, Duration, Format, Places, Tools, Tools_Other, Extra_Tools, Address, Needs_Customer_Address, Description, Image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, propose, category, startDate, startTime, duration, format, places, tools, toolsOther, JSON.stringify(extraTools), address, needsCustomerAddress, description, image]
    );
    await connection.end();
    return result.insertId;
}

// Récupère un ticket en fonction de son ID
async function getOne(id) {
    if (id === undefined) {
        throw new Error("getOne: id must be defined");
    }
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Tickets WHERE Ticket_ID = ?', [id]);
    await connection.end();
    return rows[0] || null;
}

// Récupère tous les tickets
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Tickets');
    await connection.end();
    return rows;
}

// Met à jour un ticket
async function updateOne(id, ticket) {
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }
    const connection = await getConnection();
    const { title, propose, category, startDate, startTime, duration, format, places, tools, toolsOther, extraTools, address, needsCustomerAddress, description, image } = ticket;

    const [result] = await connection.execute(
        'UPDATE Tickets SET Title = ?, Propose = ?, Category = ?, Start_Date = ?, Start_Time = ?, Duration = ?, Format = ?, Places = ?, Tools = ?, Tools_Other = ?, Extra_Tools = ?, Address = ?, Needs_Customer_Address = ?, Description = ?, Image = ? WHERE Ticket_ID = ?',
        [title, propose, category, startDate, startTime, duration, format, places, tools, toolsOther, JSON.stringify(extraTools), address, needsCustomerAddress, description, image, id]
    );
    await connection.end();
    return result.affectedRows;
}

// Supprime un ticket
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Tickets WHERE Ticket_ID = ?', [id]);
    await connection.end();
    return result.affectedRows;
}

module.exports = {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
};
