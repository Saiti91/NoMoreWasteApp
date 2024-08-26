const getConnection = require("../common/db_handler");

async function createTruck(truck) {
    const connection = await getConnection();
    const query = `
        INSERT INTO Trucks (Registration, Capacity, Model, Conditions)
        VALUES (?, ?, ?, ?)
    `;
    const values = [truck.Registration, truck.Capacity, truck.Model, truck.Conditions];
    const [result] = await connection.execute(query, values);
    await connection.end();
    return result.insertId;
}

async function getAllTrucks() {
    const connection = await getConnection();
    const query = `SELECT * FROM Trucks`;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows;
}

async function getAvailableTrucksToday() {
    const connection = await getConnection();
    const query = `
        SELECT 
            t.Truck_ID, 
            t.Registration, 
            t.Capacity, 
            t.Model, 
            t.Conditions
        FROM 
            Trucks t
        LEFT JOIN 
            Routes r ON t.Truck_ID = r.Truck_ID AND r.Date = CURDATE()
        WHERE 
            r.Route_ID IS NULL;
    `;
    const [rows] = await connection.execute(query);
    await connection.end();
    return rows.length > 0 ? rows : [];
}

async function getTruckById(truckId) {
    const connection = await getConnection();
    const query = `SELECT * FROM Trucks WHERE Truck_ID = ?`;
    const [rows] = await connection.execute(query, [truckId]);
    await connection.end();
    return rows[0];
}

async function updateTruck(truckId, truck) {
    const connection = await getConnection();
    const query = `
        UPDATE Trucks
        SET Registration = ?, Capacity = ?, Model = ?, Conditions = ?
        WHERE Truck_ID = ?
    `;
    const values = [truck.Registration, truck.Capacity, truck.Model, truck.Conditions, truckId];
    const [result] = await connection.execute(query, values);
    await connection.end();
    return result.affectedRows > 0;
}

async function getRoutesByTruckId(truckId) {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Routes WHERE Truck_ID = ?', [truckId]);
    await connection.end();
    return rows;
}

async function deleteTruck(truckId, forceDelete = false) {
    const connection = await getConnection();

    if (!forceDelete) {
        // Vérifier s'il y a des routes associées
        const [routes] = await connection.execute('SELECT 1 FROM Routes WHERE Truck_ID = ?', [truckId]);
        if (routes.length > 0) {
            throw new Error(`Cannot delete truck with ID ${truckId} as it is still referenced by routes.`);
        }
    } else {
        // Supprimer toutes les routes associées avant de supprimer le camion
        await connection.execute('DELETE FROM Routes WHERE Truck_ID = ?', [truckId]);
    }

    const query = `DELETE FROM Trucks WHERE Truck_ID = ?`;
    const [result] = await connection.execute(query, [truckId]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = { createTruck, getAvailableTrucksToday, getRoutesByTruckId, getAllTrucks, getTruckById, updateTruck, deleteTruck };
