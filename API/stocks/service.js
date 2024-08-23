const { createUserSchema, updateUserSchema } = require("./model");
const stockRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'utilisateur
async function createOne(stock) {

   await stockRepository.createOne(stock);
}

// Fonction de récupération d'un utilisateur en fonction de son ID
async function getOne(id) {
    const stock = await stockRepository.getOne(id);
}
//TODO:
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const stock = await stockRepository.getOneBy(attribute, value);
    return stock ? { ...stock } : null;
}

// Fonction de récupération de tous les utilisateurs
async function getAll() {
    const stocks = await stockRepository.getAll();
    console.log('Stocks from service:', stocks);

    // Utiliser un objet pour regrouper les produits par Product_ID
    const groupedStocks = {};

    stocks.forEach(stock => {
        const { Product_ID, Quantity, ...rest } = stock;

        if (!groupedStocks[Product_ID]) {
            // Si le produit n'est pas encore dans groupedStocks, on l'ajoute
            groupedStocks[Product_ID] = { ...rest, Product_ID, Quantity };
        } else {
            // Si le produit est déjà dans groupedStocks, on ajoute la quantité
            groupedStocks[Product_ID].Quantity += Quantity;
        }
    });

    // Convertir l'objet en tableau
    return Object.values(groupedStocks);
}

async function getAllIDs() {
    try {
        const stockIDs = await stockRepository.getAllStockIDs(); // Call the repository function
        return stockIDs; // Return the result to the controller
    } catch (error) {
        throw new Error("Failed to retrieve stock IDs");
    }
}

// Fonction de mise à jour d'un utilisateur en fonction de son ID
async function updateOne(id, quantity, storageDate) {
    const existing = await stockRepository.getOneBy("Product_ID", id);
    if (!existing) {
        throw new Error(`Stock with Product_ID ${id} does not exist`);
    }

    // Mise à jour de la date actuelle si storageDate n'est pas fourni
    if (!storageDate) {
        storageDate = new Date().toISOString().split('T')[0];
    }

    const updated = await stockRepository.updateOne(id, quantity, storageDate);
    return updated ? { ...updated } : null;
}


// Fonction de suppression d'un utilisateur
async function deleteOne(id, issuer) {
    const stock = await stockRepository.getOneBy("Product_ID", id);
    if (!stock) {
        throw new Error(`Stock with Product_ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("Vous ne pouvez pas supprimer un produit en stock sans être un administrateur.");
    }
    return await stockRepository.deleteOne(id);
}


module.exports = { createOne, getOne, getAllIDs, getOneBy, getAll, updateOne, deleteOne };
