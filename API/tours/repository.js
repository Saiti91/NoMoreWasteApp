const getConnection = require("../common/db_handler");

/**
 * Crée une nouvelle route avec ses destinations et produits associés.
 * @param {Object} tourData - Les données de la route, y compris les destinations et les produits.
 * @returns {Number} - L'ID de la route créée.
 */
async function createOne(tourData) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.execute(`
            INSERT INTO Routes (Date, User_ID, Truck_ID, Type)
            VALUES (?, ?, ?, ?)
        `, [tourData.Date, tourData.User_ID ?? null, tourData.Truck_ID, tourData.Type]);

        const routeId = result.insertId;

        for (const destination of tourData.Destinations) {
            const [destResult] = await connection.execute(`
                INSERT INTO Destinations (Route_ID, Address_ID, Type)
                VALUES (?, ?, ?)
            `, [routeId, destination.Address_ID, tourData.Type]);

            const destinationId = destResult.insertId;

            for (const product of destination.Products) {
                await connection.execute(`
                    INSERT INTO Destination_Products (Destination_ID, Product_ID, Quantity)
                    VALUES (?, ?, ?)
                `, [destinationId, product.Product_ID, product.Quantity]);
            }
        }

        await connection.commit();
        return routeId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

/**
 * Récupère les détails complets d'une route, y compris les destinations et les produits associés.
 * @param {Number} tourId - L'ID de la route à récupérer.
 * @returns {Object|null} - Un objet représentant la route ou null si la route n'existe pas.
 */
async function getOne(tourId) {
    const connection = await getConnection();

    const [routes] = await connection.execute(`
        SELECT
            r.Route_ID,
            r.Date AS Route_Date,
            r.Type AS Route_Type,
            u.User_ID AS Driver_ID,
            CONCAT(u.Firstname, ' ', u.Name) AS Driver_Name,
            t.Truck_ID,
            t.Registration AS Truck_Registration,
            t.Model AS Truck_Model,
            t.Capacity AS Truck_Capacity
        FROM
            Routes r
                JOIN
            Users u ON r.User_ID = u.User_ID
                JOIN
            Trucks t ON r.Truck_ID = t.Truck_ID
        WHERE
            r.Route_ID = ?
    `, [tourId]);

    if (routes.length === 0) {
        await connection.end();
        return null;
    }

    const route = {
        Route_ID: routes[0].Route_ID,
        Route_Date: routes[0].Route_Date,
        Route_Type: routes[0].Route_Type,
        Driver: {
            Driver_ID: routes[0].Driver_ID,
            Driver_Name: routes[0].Driver_Name
        },
        Truck: {
            Truck_ID: routes[0].Truck_ID,
            Truck_Registration: routes[0].Truck_Registration,
            Truck_Model: routes[0].Truck_Model,
            Truck_Capacity: routes[0].Truck_Capacity
        },
        Destinations: []
    };

    const [destinations] = await connection.execute(`
        SELECT
            d.Destination_ID,
            d.Type AS Destination_Type,
            a.Street,
            a.City,
            a.State,
            a.Postal_Code,
            a.Country,
            dp.Destination_Product_ID,
            p.Product_ID,
            p.Name AS Product_Name,
            p.Barcode,
            dp.Quantity AS Product_Quantity,
            c.Name AS Category_Name,
            c.StorageSector
        FROM
            Destinations d
                LEFT JOIN
            Address a ON d.Address_ID = a.Address_ID
                LEFT JOIN
            Destination_Products dp ON d.Destination_ID = dp.Destination_ID
                LEFT JOIN
            Products p ON dp.Product_ID = p.Product_ID
                LEFT JOIN
            ProductsCategories c ON p.Category_ID = c.Category_ID
        WHERE
            d.Route_ID = ?
    `, [tourId]);

    destinations.forEach(row => {
        let destination = route.Destinations.find(d => d.Destination_ID === row.Destination_ID);

        if (!destination) {
            destination = {
                Destination_ID: row.Destination_ID,
                Destination_Type: row.Destination_Type,
                Address: {
                    Street: row.Street,
                    City: row.City,
                    State: row.State,
                    Postal_Code: row.Postal_Code,
                    Country: row.Country
                },
                Products: []
            };
            route.Destinations.push(destination);
        }

        if (row.Product_ID) {
            destination.Products.push({
                Destination_Product_ID: row.Destination_Product_ID,
                Product_ID: row.Product_ID,
                Product_Name: row.Product_Name,
                Barcode: row.Barcode,
                Quantity: row.Product_Quantity,
                Category_Name: row.Category_Name,
                StorageSector: row.StorageSector
            });
        }
    });

    await connection.end();
    return route;
}

/**
 * Récupère toutes les routes avec leurs destinations et produits associés.
 * @returns {Array} - Un tableau d'objets représentant les routes.
 */
async function getAll() {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
        SELECT
            r.Route_ID,
            r.Date AS Route_Date,
            r.Type AS Route_Type,
            u.User_ID AS Driver_ID,
            CONCAT(u.Firstname, ' ', u.Name) AS Driver_Name,
            t.Truck_ID,
            t.Registration AS Truck_Registration,
            t.Model AS Truck_Model,
            t.Capacity AS Truck_Capacity,
            d.Destination_ID,
            d.Type AS Destination_Type,
            a.Street,
            a.City,
            a.State,
            a.Postal_Code,
            a.Country,
            dp.Destination_Product_ID,
            p.Product_ID,
            p.Name AS Product_Name,
            p.Barcode,
            dp.Quantity AS Product_Quantity,
            c.Name AS Category_Name,
            c.StorageSector
        FROM
            Routes r
                JOIN
            Users u ON r.User_ID = u.User_ID
                JOIN
            Trucks t ON r.Truck_ID = t.Truck_ID
                LEFT JOIN
            Destinations d ON r.Route_ID = d.Route_ID
                LEFT JOIN
            Address a ON d.Address_ID = a.Address_ID
                LEFT JOIN
            Destination_Products dp ON d.Destination_ID = dp.Destination_ID
                LEFT JOIN
            Products p ON dp.Product_ID = p.Product_ID
                LEFT JOIN
            ProductsCategories c ON p.Category_ID = c.Category_ID;
    `);

    await connection.end();

    const routes = {};

    rows.forEach(row => {
        if (!routes[row.Route_ID]) {
            routes[row.Route_ID] = {
                Route_ID: row.Route_ID,
                Route_Date: row.Route_Date,
                Route_Type: row.Route_Type,
                Driver: {
                    Driver_ID: row.Driver_ID,
                    Driver_Name: row.Driver_Name
                },
                Truck: {
                    Truck_ID: row.Truck_ID,
                    Truck_Registration: row.Truck_Registration,
                    Truck_Model: row.Truck_Model,
                    Truck_Capacity: row.Truck_Capacity
                },
                Destinations: []
            };
        }

        const route = routes[row.Route_ID];
        let destination = route.Destinations.find(d => d.Destination_ID === row.Destination_ID);

        if (!destination) {
            destination = {
                Destination_ID: row.Destination_ID,
                Destination_Type: row.Destination_Type,
                Address: {
                    Street: row.Street,
                    City: row.City,
                    State: row.State,
                    Postal_Code: row.Postal_Code,
                    Country: row.Country
                },
                Products: []
            };
            route.Destinations.push(destination);
        }

        if (row.Product_ID) {
            destination.Products.push({
                Destination_Product_ID: row.Destination_Product_ID,
                Product_ID: row.Product_ID,
                Product_Name: row.Product_Name,
                Barcode: row.Barcode,
                Quantity: row.Product_Quantity,
                Category_Name: row.Category_Name,
                StorageSector: row.StorageSector
            });
        }
    });

    return Object.values(routes);
}

/**
 * Récupère toutes les routes associées à un utilisateur spécifique.
 * @param {Number} userId - L'ID de l'utilisateur.
 * @returns {Array} - Un tableau d'objets représentant les routes de l'utilisateur.
 */
async function getAllRoutesForUser(userId) {
    const connection = await getConnection();

    try {
        const [rows] = await connection.execute(`
            SELECT 
                r.Route_ID,
                r.Date AS Route_Date,
                r.Type AS Route_Type,
                u.User_ID AS Driver_ID,
                CONCAT(u.Firstname, ' ', u.Name) AS Driver_Name,
                t.Truck_ID,
                t.Registration AS Truck_Registration,
                t.Model AS Truck_Model,
                t.Capacity AS Truck_Capacity,
                d.Destination_ID,
                d.Type AS Destination_Type,
                a.Street,
                a.City,
                a.State,
                a.Postal_Code,
                a.Country,
                dp.Destination_Product_ID,
                p.Product_ID,
                p.Name AS Product_Name,
                p.Barcode,
                dp.Quantity AS Product_Quantity
            FROM 
                Routes r
            JOIN 
                Users u ON r.User_ID = u.User_ID
            JOIN 
                Trucks t ON r.Truck_ID = t.Truck_ID
            LEFT JOIN 
                Destinations d ON r.Route_ID = d.Route_ID
            LEFT JOIN 
                Address a ON d.Address_ID = a.Address_ID
            LEFT JOIN 
                Destination_Products dp ON d.Destination_ID = dp.Destination_ID
            LEFT JOIN 
                Products p ON dp.Product_ID = p.Product_ID
            WHERE 
                r.User_ID = ?
        `, [userId]);

        const routes = {};

        rows.forEach(row => {
            // Si la route n'existe pas encore dans l'objet routes, on la crée
            if (!routes[row.Route_ID]) {
                routes[row.Route_ID] = {
                    Route_ID: row.Route_ID,
                    Route_Date: row.Route_Date,
                    Route_Type: row.Route_Type,
                    Driver: {
                        Driver_ID: row.Driver_ID,
                        Driver_Name: row.Driver_Name
                    },
                    Truck: {
                        Truck_ID: row.Truck_ID,
                        Truck_Registration: row.Truck_Registration,
                        Truck_Model: row.Truck_Model,
                        Truck_Capacity: row.Truck_Capacity
                    },
                    Destinations: []
                };
            }

            // Si la destination existe, on la met à jour, sinon, on la crée
            const route = routes[row.Route_ID];
            let destination = route.Destinations.find(d => d.Destination_ID === row.Destination_ID);

            if (!destination) {
                destination = {
                    Destination_ID: row.Destination_ID,
                    Destination_Type: row.Destination_Type,
                    Address: {
                        Street: row.Street,
                        City: row.City,
                        State: row.State,
                        Postal_Code: row.Postal_Code,
                        Country: row.Country
                    },
                    Products: []
                };
                route.Destinations.push(destination);
            }

            // On ajoute les produits à la destination
            if (row.Product_ID) {
                destination.Products.push({
                    Destination_Product_ID: row.Destination_Product_ID,
                    Product_ID: row.Product_ID,
                    Product_Name: row.Product_Name,
                    Barcode: row.Barcode,
                    Quantity: row.Product_Quantity
                });
            }
        });

        // Conversion des routes en tableau pour le retour
        return Object.values(routes);
    } finally {
        await connection.end();
    }
}

/**
 * Met à jour les informations de base d'une route (Date, User_ID, Truck_ID, Type).
 * @param {Number} id - L'ID de la route à mettre à jour.
 * @param {Object} data - Les données à mettre à jour.
 * @returns {Object} - Un objet représentant la route mise à jour.
 */
async function updateOne(id, data) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const routeFields = ['Date', 'User_ID', 'Truck_ID', 'Type'];
        const routeUpdates = routeFields.filter(field => field in data);

        if (routeUpdates.length > 0) {
            const fields = routeUpdates.map(field => `${field} = ?`).join(", ");
            const values = routeUpdates.map(field => data[field]);
            values.push(id);

            await connection.execute(`
                UPDATE Routes
                SET ${fields}
                WHERE Route_ID = ?
            `, values);
        }

        await connection.commit();
        return { Route_ID: id, ...data };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

/**
 * Supprime une route, ses destinations, et les produits associés.
 * @param {Number} id - L'ID de la route à supprimer.
 * @returns {Boolean} - True si la suppression a été effectuée, sinon False.
 */
async function deleteOne(id) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(`
            DELETE FROM Destination_Products WHERE Destination_ID IN (SELECT Destination_ID FROM Destinations WHERE Route_ID = ?)
        `, [id]);

        await connection.execute(`
            DELETE FROM Destinations WHERE Route_ID = ?
        `, [id]);

        const [result] = await connection.execute(`
            DELETE FROM Routes WHERE Route_ID = ?
        `, [id]);

        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

/**
 * Ajoute une nouvelle destination à une route existante.
 * @param {Number} routeId - L'ID de la route à laquelle ajouter la destination.
 * @param {Object} destinationData - Les données de la nouvelle destination.
 * @returns {Number} - L'ID de la destination ajoutée.
 */
async function addDestination(routeId, destinationData) {
    const connection = await getConnection();
    const [result] = await connection.execute(`
        INSERT INTO Destinations (Route_ID, Address_ID, Type)
        VALUES (?, ?, ?)
    `, [routeId, destinationData.Address_ID, destinationData.Type]);
    await connection.end();
    return result.insertId;
}

/**
 * Supprime une destination d'une route existante.
 * @param routeId
 * @param destinationId
 * @returns {Promise<void>}
 */
async function removeDestination(routeId, destinationId) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(`
            DELETE FROM Destination_Products WHERE Destination_ID = ?
        `, [destinationId]);

        await connection.execute(`
            DELETE FROM Destinations WHERE Destination_ID = ?
        `, [destinationId]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

/**
 * Ajoute un produit à une destination existante.
 * @param {Number} destinationId - L'ID de la destination à laquelle ajouter le produit.
 * @param {Object} productData - Les données du produit à ajouter.
 */
async function addProductToDestination(destinationId, productData) {
    const connection = await getConnection();
    await connection.execute(`
        INSERT INTO Destination_Products (Destination_ID, Product_ID, Quantity)
        VALUES (?, ?, ?)
    `, [destinationId, productData.Product_ID, productData.Quantity]);
    await connection.end();
}

/**
 * Supprime un produit d'une destination existante.
 * @param {Number} destinationId - L'ID de la destination de laquelle supprimer le produit.
 * @param {Number} productId - L'ID du produit à supprimer.
 */
async function removeProductFromDestination(destinationId, productId) {
    const connection = await getConnection();
    await connection.execute(`
        DELETE FROM Destination_Products WHERE Destination_ID = ? AND Product_ID = ?
    `, [destinationId, productId]);
    await connection.end();
}

module.exports = {
    createOne,
    getAll,
    getOne,
    updateOne,
    deleteOne,
    addDestination,
    removeDestination,
    addProductToDestination,
    removeProductFromDestination,
    getAllRoutesForUser
};
