const { createDonationSchema, updateDonationSchema } = require("./model");
const donationRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'utilisateur
async function createOne(stock) {

   await donationRepository.createOne(stock);
}

// Fonction de récupération d'un utilisateur en fonction de son ID
async function getOneDonor(id) {
    if (id === undefined) {
        throw new Error("getOne: ID must be defined");
    }
    const stock = await donationRepository.getDonationsBy('Donor_User_ID',id);
    return stock ? { ...stock } : null;
}

async function getOneDonation(id) {
    if (id === undefined) {
        throw new Error("getOne: ID must be defined");
    }
    const stock = await donationRepository.getDonationsBy('Donation_ID',id);
    return stock ? { ...stock } : null;
}

async function getOneProduct(id) {
    if (id === undefined) {
        throw new Error("getOne: ID must be defined");
    }
    const stock = await donationRepository.getDonationsBy('Product_ID',id);
    return stock ? { ...stock } : null;
}


//TODO:
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const donation = await donationRepository.getOneBy(attribute, value);
    return donation ? { ...donation } : null;
}

// Fonction de récupération de tous les utilisateurs
async function getAll() {
    const donations = await donationRepository.getAll();
    return donations.map(donation => ({ ...donation}));
}

// Fonction de mise à jour d'un utilisateur en fonction de son ID
async function updateOne(id, data) {
    // Validation de la requête
    const { error } = updateDonationSchema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }
    // Vérification de l'existence de la donation
    const existing = await donationRepository.getOneBy("Product_ID", id);
    if (!existing) {
        throw new Error(`Donation with Product_ID ${id} does not exist`);
    }
    // Mise à jour de la donation
    const updated = await donationRepository.updateOne(id, data);
    return updated ? { ...updated } : null;
}

// Fonction de suppression d'un utilisateur
async function deleteOne(id, issuer) {
    const stock = await donationRepository.getOneBy("Product_ID", id);
    if (!stock) {
        throw new Error(`Stock with Product_ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("Vous ne pouvez pas supprimer un produit en stock sans être un administrateur.");
    }
    return await donationRepository.deleteOne(id);
}


module.exports = { createOne, getOneDonation, getOneDonor, getOneProduct, getOneBy, getAll, updateOne, deleteOne };
