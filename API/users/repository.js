const getConnection = require("../common/db_handler");
const {join} = require("node:path");
const {mkdirSync} = require("node:fs");

// Création d'un utilisateur classique et de son adresse
async function createOne(user) {
    console.log('User in repository:', user);

    const {
        name = null,
        firstname = null,
        address = {}, // L'objet adresse contenant street, city, state, postal_code, country
        phone = null,
        email = null,
        password = null,
        birthdate = null,
        current_subscription = null
    } = user;

    const connection = await getConnection();

    try {
        // Insérer l'adresse dans la table Addresses et récupérer l'ID généré
        const [addressResult] = await connection.execute(
            'INSERT INTO Address (Street, City, State, Postal_Code, Country) VALUES (?, ?, ?, ?, ?)',
            [address.street, address.city, address.state, address.postal_code, address.country]
        );
        const address_id = addressResult.insertId;

        // Insérer l'utilisateur dans la table Users avec l'Address_ID
        const [result] = await connection.execute(
            'INSERT INTO Users (Name, Firstname, Address_ID, Phone, Email, Password, Birthdate, Current_Subscription) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, firstname, address_id, phone, email, password, birthdate, current_subscription]
        );

        const user_id = result.insertId;

        // Créer le dossier pour l'utilisateur
        const userDir = join(__dirname, '..', 'uploads', 'justificatif', String(user_id));
        mkdirSync(userDir, { recursive: true });

        console.log(`Directory created at: ${userDir}`);

        await connection.end();
        return user_id;

    } catch (error) {
        await connection.end();
        console.error("Error creating user and directory:", error);
        throw error;
    }
}


// Récupère un utilisateur en fonction de son ID
async function getOne(id) {
    if (id === undefined) {
        throw new Error("getOne: id must be defined");
    }
    const connection = await getConnection();

    const query = `
        SELECT u.*, a.Street, a.City, a.State, a.Postal_Code, a.Country
        FROM Users u
        LEFT JOIN Address a ON u.Address_ID = a.Address_ID
        WHERE u.User_ID = ?
    `;

    const [rows] = await connection.execute(query, [id]);
    await connection.end();
    return rows[0] || null;
}

async function checkPassword(id, password) {
    if (id === undefined || password === undefined) {
        throw new Error("checkPassword: Both id and password must be defined");
    }
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Users WHERE User_ID = ? AND Password = ?', [id, password]);
    await connection.end();
    return rows[0] || null;
}

// Récupère un ou plusieurs utilisateurs en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const connection = await getConnection();
    const [rows] = await connection.execute(`SELECT *
                                             FROM Users
                                             WHERE ${attribute} = ?`, [value]);
    await connection.end();
    return rows[0] || null;
}

async function getOneVerifBy(attribute, value, id) {
    if (attribute === undefined || value === undefined || id === undefined) {
        throw new Error("getOneVerifBy: Attribute, value, and id must be defined");
    }

    const connection = await getConnection();
    const query = `SELECT *
                   FROM Users
                   WHERE ${attribute} = ?
                     AND User_ID = ?`;
    const [rows] = await connection.execute(query, [value, id]);
    await connection.end();
    return rows[0] || null;
}

async function verifySkill(User_id, skillName) {
    if (User_id === undefined || skillName === undefined) {
        throw new Error("verifySkill: Both User_id and skillName must be defined");
    }
    const connection = await getConnection();
    try {
        const [skillRows] = await connection.execute(`SELECT Skill_ID
                                                      FROM Skills
                                                      WHERE Name = ?`, [skillName]);
        if (skillRows.length === 0) {
            throw new Error(`Skill "${skillName}" not found`);
        }
        const skillId = skillRows[0].Skill_ID;
        const [userSkillRows] = await connection.execute(`SELECT *
                                                          FROM User_Skills
                                                          WHERE User_ID = ?
                                                            AND Skill_ID = ?`, [User_id, skillId]);
        return userSkillRows[0] || null;
    } finally {
        await connection.end();
    }
}


// Récupère tous les utilisateurs
async function getAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Users');
    await connection.end();
    return rows;
}

// MAJ un utilisateur
async function updateOne(id, user) {
    if (id === undefined) {
        throw new Error("updateOne: id must be defined");
    }

    const connection = await getConnection();
    console.log("User before update:", user);

    try {
        await connection.beginTransaction();

        const {
            Name,
            Firstname,
            Password,
            Phone,
            Email,
            Birthdate,
            Current_Subscription,
            address = {}
        } = user;

        const userDetails = {
            ...(Name !== undefined && { Name }),
            ...(Firstname !== undefined && { Firstname }),
            ...(Password !== undefined && { Password }),
            ...(Phone !== undefined && { Phone }),
            ...(Email !== undefined && { Email }),
            ...(Birthdate !== undefined && { Birthdate }),
            ...(Current_Subscription !== undefined && { Current_Subscription })
        };

        console.log("User Details to Update:", userDetails);

        if (Object.keys(userDetails).length > 0) {
            const userUpdateStr = Object.keys(userDetails)
                .map((k) => `${k} = ?`)
                .join(', ');

            const userValues = [...Object.values(userDetails), id];
            const [userResult] = await connection.execute(
                `UPDATE Users SET ${userUpdateStr} WHERE User_ID = ?`,
                userValues
            );
            console.log("User Update Query Result:", userResult);
        }

        if (Object.keys(address).length > 0) {
            const { street, city, state, postal_code, country } = address;

            const addressDetails = {
                ...(street !== undefined && { Street: street }),
                ...(city !== undefined && { City: city }),
                ...(state !== undefined && { State: state }),
                ...(postal_code !== undefined && { Postal_Code: postal_code }),
                ...(country !== undefined && { Country: country })
            };

            console.log("Address Details to Update:", addressDetails);

            if (Object.keys(addressDetails).length > 0) {
                // Récupérer l'ID de l'adresse de l'utilisateur
                const [rows] = await connection.execute(
                    `SELECT Address_ID FROM Users WHERE User_ID = ?`,
                    [id]
                );
                if (rows.length === 0) {
                    throw new Error("updateOne: No address found for this user.");
                }

                const addressId = rows[0].Address_ID;

                const addressUpdateStr = Object.keys(addressDetails)
                    .map((k) => `${k} = ?`)
                    .join(', ');

                const addressValues = [...Object.values(addressDetails), addressId];
                const [addressResult] = await connection.execute(
                    `UPDATE Address SET ${addressUpdateStr} WHERE Address_ID = ?`,
                    addressValues
                );
                console.log("Address Update Query Result:", addressResult);
            }
        }

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        console.error("Error during update:", error);
        throw error;
    } finally {
        await connection.end();
    }
}


// Supprime un utilisateur par son ID
async function deleteOne(id) {
    if (id === undefined) {
        throw new Error("deleteOne: id must be defined");
    }
    const connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM Users WHERE User_ID = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}

module.exports = {createOne, getOne, getOneVerifBy, verifySkill, getAll, updateOne, deleteOne, getOneBy, checkPassword,
    updateOne};
