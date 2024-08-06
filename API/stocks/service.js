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

// Fonction de récupération de tous les utilisateurs
async function getAll() {
    const stocks = await stockRepository.getAll();
    return stocks.map(stock => ({ ...stock}));
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


module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
