const Repository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction pour créer une inscription d'un utilisateur à un ticket
async function createOne(ticketId, userId) {
    if (!ticketId || !userId) {
        throw new InvalidArgumentError("Ticket ID et User ID sont requis.");
    }

    return await Repository.createOne(ticketId, userId);
}

// Fonction pour supprimer une inscription d'un utilisateur à un ticket
async function deleteOne(ticketId, userId) {
    if (!ticketId || !userId) {
        throw new InvalidArgumentError("Ticket ID et User ID sont requis.");
    }

    return await Repository.deleteOne(ticketId, userId);
}

// Fonction pour récupérer toutes les inscriptions
async function getAll() {
    return await Repository.getAll();
}

// Fonction pour récupérer toutes les inscriptions pour un ticket particulier
async function getAllForTicket(ticketId) {
    if (!ticketId) {
        throw new InvalidArgumentError("Ticket ID est requis.");
    }

    return await Repository.getAllForTicket(ticketId);
}

// Fonction pour récupérer toutes les inscriptions pour un utilisateur particulier
async function getAllForUser(userId) {
    if (!userId) {
        throw new InvalidArgumentError("User ID est requis.");
    }

    return await Repository.getAllForUser(userId);
}

module.exports = {
    createOne,
    deleteOne,
    getAll,
    getAllForTicket,
    getAllForUser
};
