const getConnection = require("../common/db_handler");

async function createOne(subscription) {
    const connection = await getConnection();
    const { user_id, end_date, amount, status } = subscription;

    const [result] = await connection.execute(
        'INSERT INTO Subscriptions (User_ID, End_Date, Amount, Status) VALUES (?, ?, ?, ?)',
        [user_id, end_date, amount, status]
    );

    await connection.end();
    return result.insertId;
}

async function getOne(userId) {
    const connection = await getConnection();
    const [rows] = await connection.execute(
        'SELECT * FROM Subscriptions WHERE User_ID = ? ORDER BY End_Date DESC LIMIT 1',
        [userId]
    );
    await connection.end();
    return rows.length ? rows[0] : null;
}

async function updateOne(userId, updateData) {
    const connection = await getConnection();
    const updates = [];
    const values = [];

    if (updateData.end_date) {
        updates.push("End_Date = ?");
        values.push(updateData.end_date);
    }
    if (updateData.amount) {
        updates.push("Amount = ?");
        values.push(updateData.amount);
    }
    if (updateData.status !== undefined) {
        updates.push("Status = ?");
        values.push(updateData.status);
    }

    if (!updates.length) return null;

    values.push(userId);

    const [result] = await connection.execute(
        `UPDATE Subscriptions SET ${updates.join(', ')} WHERE User_ID = ? ORDER BY End_Date DESC LIMIT 1`,
        values
    );

    await connection.end();
    return result.affectedRows > 0;
}

module.exports = {
    createOne,
    getOne,
    updateOne,
};
