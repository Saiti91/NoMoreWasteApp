const { createDonationSchema, updateDonationSchema } = require("./model");
const donationRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'une donation
async function createOne(donation) {
    // Validate the donation data
    const { error } = createDonationSchema.validate(donation);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Create the donation
    const createdDonation = await donationRepository.createOne(donation);
    return createdDonation;
}

// Fonction de récupération des donations par Donor_User_ID
async function getOneDonor(id) {
    if (id === undefined) {
        throw new Error("getOneDonor: ID must be defined");
    }
    const donations = await donationRepository.getDonationsBy('Donor_User_ID', id);
    return donations.length ? donations : null;
}

// Fonction de récupération d'une donation par son ID
async function getOneDonation(id) {
    if (id === undefined) {
        throw new Error("getOneDonation: ID must be defined");
    }
    const donation = await donationRepository.getDonationsBy('Donation_ID', id);
    return donation.length ? donation[0] : null;
}

// Fonction de récupération des donations par Product_ID
async function getOneProduct(id) {
    if (id === undefined) {
        throw new Error("getOneProduct: ID must be defined");
    }
    const donations = await donationRepository.getDonationsBy('Product_ID', id);
    return donations.length ? donations : null;
}

// Fonction de récupération des donations par un attribut spécifique
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const donations = await donationRepository.getDonationsBy(attribute, value);
    return donations.length ? donations : null;
}

// Fonction de récupération de toutes les donations
async function getAll() {
    const donations = await donationRepository.getAll();
    return donations.map(donation => ({ ...donation }));
}

// Fonction de mise à jour d'une donation en fonction de son ID
async function updateOne(id, data) {
    // Validation des données de la requête
    const { error } = updateDonationSchema.validate(data);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Vérification de l'existence de la donation
    const existing = await getOneDonation(id);
    if (!existing) {
        throw new Error(`Donation with ID ${id} does not exist`);
    }

    // Mise à jour de la donation
    const updated = await donationRepository.updateOne(id, data);
    return updated ? { ...updated } : null;
}

// Fonction de suppression d'une donation
async function deleteOne(id, issuer) {
    const donation = await getOneDonation(id);
    if (!donation) {
        throw new Error(`Donation with ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("Vous ne pouvez pas supprimer une donation sans être un administrateur.");
    }
    return await donationRepository.deleteOne(id);
}

module.exports = { createOne, getOneDonation, getOneDonor, getOneProduct, getOneBy, getAll, updateOne, deleteOne };
