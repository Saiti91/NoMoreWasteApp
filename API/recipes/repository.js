const getConnection = require("../common/db_handler");

// Création d'une recette
async function createRecipe(name, instructions) {
    if (!name || !instructions) {
        throw new Error("createRecipe: Name and instructions must be defined");
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const query = `
            INSERT INTO Recipes (Name, Instructions)
            VALUES (?, ?)
        `;
        const [result] = await connection.execute(query, [name, instructions]);

        await connection.commit();
        console.log('result from repository:', result.insertId);
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

// Ajout d'un ingrédient à une recette
async function addIngredient(recipeId, productId, quantity, unit, description) {
    if (!recipeId || !productId || !quantity) {
        throw new Error("addIngredient: Recipe ID, Product ID, and Quantity must be defined");
    }

    const connection = await getConnection();
    try {
        const query = `
            INSERT INTO Recipes_Ingredients (Recipes_ID, Product_ID, Quantity, Unit, Description)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Replace undefined with null
        await connection.execute(query, [
            recipeId,
            productId,
            quantity,
            unit !== undefined ? unit : null,           // Unit should be null if undefined
            description !== undefined ? description : null // Description should be null if undefined
        ]);
    } finally {
        await connection.end();
    }
}

// Récupération de toutes les recettes avec le nom des ingrédients
async function getAllRecipes() {
    const connection = await getConnection();
    const query = `
        SELECT r.Recipes_ID, r.Name, r.Instructions,
               ri.Product_ID, p.Name AS Product_Name, ri.Quantity, ri.Unit, ri.Description
        FROM Recipes r
                 LEFT JOIN Recipes_Ingredients ri ON r.Recipes_ID = ri.Recipes_ID
                 LEFT JOIN Products p ON ri.Product_ID = p.Product_ID
    `;
    const [rows] = await connection.execute(query);
    await connection.end();

    // Transformer les résultats en format souhaité
    const recipes = {};
    rows.forEach(row => {
        if (!recipes[row.Recipes_ID]) {
            recipes[row.Recipes_ID] = {
                Recipes_ID: row.Recipes_ID,
                Name: row.Name,
                Instructions: row.Instructions,
                Ingredients: []
            };
        }
        recipes[row.Recipes_ID].Ingredients.push({
            Product_ID: row.Product_ID,
            Name: row.Product_Name,
            Quantity: row.Quantity,
            Unit: row.Unit,
            Description: row.Description
        });
    });

    return Object.values(recipes);
}

// Récupération d'une recette par son ID avec le nom des ingrédients
async function getRecipeById(id) {
    if (!id) {
        throw new Error("getRecipeById: ID must be defined");
    }

    const connection = await getConnection();
    const query = `
        SELECT r.Recipes_ID, r.Name, r.Instructions,
               ri.Product_ID, p.Name AS Product_Name, ri.Quantity, ri.Unit, ri.Description
        FROM Recipes r
                 LEFT JOIN Recipes_Ingredients ri ON r.Recipes_ID = ri.Recipes_ID
                 LEFT JOIN Products p ON ri.Product_ID = p.Product_ID
        WHERE r.Recipes_ID = ?
    `;
    const [rows] = await connection.execute(query, [id]);
    await connection.end();

    if (rows.length === 0) {
        return null;
    }

    const recipe = {
        Recipes_ID: rows[0].Recipes_ID,
        Name: rows[0].Name,
        Instructions: rows[0].Instructions,
        Ingredients: []
    };

    rows.forEach(row => {
        recipe.Ingredients.push({
            Product_ID: row.Product_ID,
            Name: row.Product_Name,
            Quantity: row.Quantity,
            Unit: row.Unit,
            Description: row.Description
        });
    });

    return recipe;
}

// Mise à jour d'une recette
async function updateRecipe(id, name, instructions) {
    if (!id || !name || !instructions) {
        throw new Error("updateRecipe: ID, Name, and Instructions must be defined");
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const query = `
            UPDATE Recipes
            SET Name = ?, Instructions = ?
            WHERE Recipes_ID = ?
        `;
        await connection.execute(query, [name, instructions, id]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

// Suppression d'une recette et de ses ingrédients associés
async function deleteRecipe(id) {
    if (!id) {
        throw new Error("deleteRecipe: ID must be defined");
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute('DELETE FROM Recipes_Ingredients WHERE Recipes_ID = ?', [id]);
        await connection.execute('DELETE FROM Recipes WHERE Recipes_ID = ?', [id]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createRecipe,
    addIngredient,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe
};
