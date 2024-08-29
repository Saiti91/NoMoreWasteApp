const getConnection = require("../common/db_handler");

/**
 * Crée une nouvelle route avec ses destinations et produits associés.
 * @param {Object} tourData - Les données de la route, y compris les destinations et les produits.
 * @returns {Number} - L'ID de la route créée.
 */
async function createCollectOne(tourData) {
    console.log('In Repository: ', tourData);

    const {
        Date,
        Time,  // Ajout de l'heure
        User_ID = null,
        Truck_ID = null,
        Type = null,
        Destinations = []
    } = tourData;

    const connection = await getConnection();

    try {
        await connection.beginTransaction();

        // Insert the route into the Routes table
        const [result] = await connection.execute(`
            INSERT INTO Routes (Date, Time, User_ID, Truck_ID, Type)
            VALUES (?, ?, ?, ?, ?)
        `, [Date, Time, User_ID, Truck_ID, Type]);  // Insertion de l'heure (Hours)

        const routeId = result.insertId;

        // Insert destinations associated with the route
        for (const destination of Destinations) {
            const {
                Address_ID = null,
                Products = []
            } = destination;

            const [destResult] = await connection.execute(`
                INSERT INTO Destinations (Route_ID, Address_ID, Type)
                VALUES (?, ?, ?)
            `, [routeId, Address_ID, Type]);

            const destinationId = destResult.insertId;

            // Insert each product associated with the destination
            for (const product of Products) {
                const {
                    Donation_ID = null,  // Get Donation_ID to update the donation
                    Quantity = 0
                } = product;

                // Fetch the Product_ID using the Donation_ID
                const [donationRow] = await connection.execute(`
                    SELECT Product_ID
                    FROM Donations
                    WHERE Donation_ID = ?
                `, [Donation_ID]);

                const Product_ID = donationRow.length > 0 ? donationRow[0].Product_ID : null;

                if (Product_ID) {
                    await connection.execute(`
                        INSERT INTO Destination_Products (Destination_ID, Product_ID, Quantity)
                        VALUES (?, ?, ?)
                    `, [destinationId, Product_ID, Quantity]);

                    // Update the donation to associate it with the route
                    await connection.execute(`
                        UPDATE Donations
                        SET Route_ID = ?
                        WHERE Donation_ID = ?
                    `, [routeId, Donation_ID]);
                } else {
                    console.warn(`Product_ID not found for Donation_ID: ${Donation_ID}`);
                }
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

async function createDistributionOne(tourData) {
    console.log('In Repository: ', tourData);

    const {
        Date,
        Hours,  // Ajout de l'heure
        User_ID = null,
        Truck_ID = null,
        Type = null,
        Destinations = []
    } = tourData;

    const connection = await getConnection();

    try {
        await connection.beginTransaction();

        // Insert the route into the Routes table
        const [result] = await connection.execute(`
            INSERT INTO Routes (Date, Time, User_ID, Truck_ID, Type)
            VALUES (?, ?, ?, ?, ?)
        `, [Date, Hours, User_ID, Truck_ID, Type]);  // Insertion de l'heure (Hours)

        const routeId = result.insertId;

        // Insert destinations associated with the route
        for (const destination of Destinations) {
            const {
                Address_ID = null,
                Products = []
            } = destination;

            const [destResult] = await connection.execute(`
                INSERT INTO Destinations (Route_ID, Address_ID, Type)
                VALUES (?, ?, ?)
            `, [routeId, Address_ID, Type]);

            const destinationId = destResult.insertId;

            // Insert each product associated with the destination and update the associated request
            for (const product of Products) {
                const {
                    Request_ID = null,  // Get Request_ID to update the request
                    Quantity = 0
                } = product;

                // Fetch the Product_ID using the Request_ID
                const [requestRow] = await connection.execute(`
                    SELECT Product_ID
                    FROM Requests
                    WHERE Request_ID = ?
                `, [Request_ID]);

                const Product_ID = requestRow.length > 0 ? requestRow[0].Product_ID : null;

                if (Product_ID) {
                    await connection.execute(`
                        INSERT INTO Destination_Products (Destination_ID, Product_ID, Quantity)
                        VALUES (?, ?, ?)
                    `, [destinationId, Product_ID, Quantity]);

                    // Update the request to associate it with the route and mark it as processed
                    await connection.execute(`
                        UPDATE Requests
                        SET Route_ID = ?, Processed = 1, Processed_Date = NOW()
                        WHERE Request_ID = ?
                    `, [routeId, Request_ID]);
                } else {
                    console.warn(`Product_ID not found for Request_ID: ${Request_ID}`);
                }
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
        SELECT r.Route_ID,
               r.Date                           AS Route_Date,
               r.Time                           AS Route_Time,
               r.Type                           AS Route_Type,
               u.User_ID                        AS Driver_ID,
               CONCAT(u.Firstname, ' ', u.Name) AS Driver_Name,
               t.Truck_ID,
               t.Registration                   AS Truck_Registration,
               t.Model                          AS Truck_Model,
               t.Capacity                       AS Truck_Capacity
        FROM Routes r
                 LEFT JOIN
             Users u ON r.User_ID = u.User_ID
                 JOIN
             Trucks t ON r.Truck_ID = t.Truck_ID
        WHERE r.Route_ID = ?
    `, [tourId]);

    if (routes.length === 0) {
        await connection.end();
        return null;
    }

    const route = {
        Route_ID: routes[0].Route_ID,
        Route_Date: routes[0].Route_Date,
        Route_Time: routes[0].Route_Time,
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
            d.Validated,  -- Add Validated status
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
                Validated: row.Validated,  // Include Validated status
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
        SELECT r.Route_ID,
               r.Date                           AS Route_Date,
               r.Time                           AS Route_Time,
               r.Type                           AS Route_Type,
               u.User_ID                        AS Driver_ID,
               CONCAT(u.Firstname, ' ', u.Name) AS Driver_Name,
               t.Truck_ID,
               t.Registration                   AS Truck_Registration,
               t.Model                          AS Truck_Model,
               t.Capacity                       AS Truck_Capacity,
               d.Destination_ID,
               d.Type                           AS Destination_Type,
               d.Validated,  -- Add Validated status
               a.Street,
               a.City,
               a.State,
               a.Postal_Code,
               a.Country,
               dp.Destination_Product_ID,
               p.Product_ID,
               p.Name                           AS Product_Name,
               p.Barcode,
               dp.Quantity                      AS Product_Quantity,
               c.Name                           AS Category_Name,
               c.StorageSector
        FROM Routes r
                 JOIN
             Trucks t ON r.Truck_ID = t.Truck_ID
                 LEFT JOIN
             Users u ON r.User_ID = u.User_ID
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
                Route_Time: row.Route_Time,
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
                Validated: row.Validated,  // Include Validated status
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
                r.Time AS Route_Time,
                r.Type AS Route_Type,
                u.User_ID AS Driver_ID,
                CONCAT(u.Firstname, ' ', u.Name) AS Driver_Name,
                t.Truck_ID,
                t.Registration AS Truck_Registration,
                t.Model AS Truck_Model,
                t.Capacity AS Truck_Capacity,
                d.Destination_ID,
                d.Type AS Destination_Type,
                d.Validated,  -- Add Validated status
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
            if (!routes[row.Route_ID]) {
                routes[row.Route_ID] = {
                    Route_ID: row.Route_ID,
                    Route_Date: row.Route_Date,
                    Route_Time: row.Route_Time,
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
                    Validated: row.Validated,  // Include Validated status
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
                    Quantity: row.Product_Quantity
                });
            }
        });

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

        const routeFields = ['Date', 'Time', 'User_ID', 'Truck_ID', 'Type'];
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

        // Delete all products associated with the destinations of the route
        await connection.execute(`
            DELETE FROM Destination_Products
            WHERE Destination_ID IN (
                SELECT Destination_ID FROM Destinations WHERE Route_ID = ?
            )
        `, [id]);

        // Delete all destinations associated with the route
        await connection.execute(`
            DELETE FROM Destinations WHERE Route_ID = ?
        `, [id]);

        // Delete the route itself
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

async function validateDestinationProducts(destinationId) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        // Validate products for the destination by adding them to the stock
        const [products] = await connection.execute(`
            SELECT Product_ID, Quantity 
            FROM Destination_Products 
            WHERE Destination_ID = ?
        `, [destinationId]);

        for (const product of products) {
            await connection.execute(`
                UPDATE Stocks
                SET Quantity = Quantity + ?
                WHERE Product_ID = ?
            `, [product.Quantity, product.Product_ID]);
        }

        // Mark the destination as validated
        await connection.execute(`
            UPDATE Destinations
            SET Validated = 1
            WHERE Destination_ID = ?
        `, [destinationId]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

async function validateAllDestinationsProducts(routeId) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        // Get all destinations for the route
        const [destinations] = await connection.execute(`
            SELECT Destination_ID
            FROM Destinations
            WHERE Route_ID = ?
        `, [routeId]);

        for (const destination of destinations) {
            await validateDestinationProducts(destination.Destination_ID);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createCollectOne,
    createDistributionOne,
    getAll,
    getOne,
    validateDestinationProducts,
    validateAllDestinationsProducts,
    updateOne,
    deleteOne,
    addDestination,
    removeDestination,
    addProductToDestination,
    removeProductFromDestination,
    getAllRoutesForUser
};
