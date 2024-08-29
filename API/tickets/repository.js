const getConnection = require('../common/db_handler');

// Création d'un ticket
async function createOne(ticket) {
    const {
        title,
        direction,
        startDate,
        startTime,
        endOfSubscription = null,
        duration,
        places = null,
        tools = null,
        addressId = null,
        addressNeeds = false,
        customersAddress = null,
        description,
        statusId = 1,
        ownerUserId,
        skillId
    } = ticket;

    // Calculer endOfSubscription si non fourni
    const calculatedEndOfSubscription = endOfSubscription || new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log("ticket from repository", ticket);

    const connection = await getConnection();

    let fetchedAddressId = addressId;
    if (!addressId) { // Fetcher l'adresse de l'utilisateur si non fournie
        const [userRows] = await connection.execute(
            `SELECT Address_ID FROM Users WHERE User_ID = ? LIMIT 1`,
            [ownerUserId]
        );
        if (userRows.length > 0) {
            fetchedAddressId = userRows[0].Address_ID;
        }
    }

    const [result] = await connection.execute(
        `INSERT INTO Tickets (Title, Direction, Start_Date, Start_Time, End_Of_Subscription, Duration, Places, Tools,
                              Address_ID, Address_needs, Customers_Address, Description, Status_ID,
                              Owner_User_ID, Skill_ID)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title,
            direction,
            startDate,
            startTime,
            calculatedEndOfSubscription,
            duration,
            places,
            tools,
            fetchedAddressId,
            addressNeeds,
            customersAddress,
            description,
            statusId,
            ownerUserId,
            skillId
        ]
    );

    await connection.end();
    return result.insertId; // Renvoie l'ID du ticket créé
}

// Récupère un ticket en fonction de son ID avec les données de l'utilisateur et de l'adresse
async function getOne(id) {
    if (id === undefined) {
        throw new Error("getOne: id must be defined");
    }
    const connection = await getConnection();
    const [rows] = await connection.execute(`
        SELECT t.*,
               u.Name      AS OwnerName,
               u.Firstname AS OwnerFirstname,
               u.Email     AS OwnerEmail,
               a.Street,
               a.City,
               a.State,
               a.Postal_Code,
               a.Country,
               s.Name      AS SkillName -- Ajouter le nom de la compétence
        FROM Tickets t
                 JOIN Users u ON t.Owner_User_ID = u.User_ID
                 LEFT JOIN Address a ON t.Address_ID = a.Address_ID
                 LEFT JOIN Skills s ON t.Skill_ID = s.Skill_ID -- Jointure avec Skills
        WHERE t.Ticket_ID = ?
    `, [id]);
    await connection.end();
    return rows[0] || null;
}


// Récupère tous les tickets avec les données de l'utilisateur et de l'adresse
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
        SELECT t.*,
               u.Name      AS OwnerName,
               u.Firstname AS OwnerFirstname,
               u.Email     AS OwnerEmail,
               a.Street,
               a.City,
               a.State,
               a.Postal_Code,
               a.Country,
               s.Name      AS SkillName -- Ajouter le nom de la compétence
        FROM Tickets t
                 JOIN Users u ON t.Owner_User_ID = u.User_ID
                 LEFT JOIN Address a ON t.Address_ID = a.Address_ID
                 LEFT JOIN Skills s ON t.Skill_ID = s.Skill_ID -- Jointure avec Skills
    `);
    await connection.end();
    return rows;
}

// Met à jour un ticket
async function updateOne(id, ticket) {
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }
    const connection = await getConnection();
    const {
        title,
        direction,
        startDate,
        startTime, // Nouveau champ
        endOfSubscription,
        duration,
        places,
        tools,
        addressId,
        addressNeeds,
        customersAddress,
        description,
        statusId,
        ownerUserId,
        skillId // Nouveau champ
    } = ticket;

    const [result] = await connection.execute(
        `UPDATE Tickets
         SET Title = ?,
             Direction = ?,
             Start_Date = ?,
             Start_Time = ?,
             End_Of_Subscription = ?,
             Duration = ?,
             Places = ?,
             Tools = ?,
             Address_ID = ?,
             Address_needs = ?,
             Customers_Address = ?,
             Description = ?,
             Status_ID = ?,
             Owner_User_ID = ?,
             Skill_ID = ?
         WHERE Ticket_ID = ?`,
        [title, direction, startDate, startTime, endOfSubscription, duration, places, tools, addressId, addressNeeds, customersAddress, description, statusId, ownerUserId, skillId, id]
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

//
async function getAllForUser(userId) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM Tickets WHERE Owner_User_ID = ?',
            [userId]
        );
        return rows;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
    getAllForUser,
};
