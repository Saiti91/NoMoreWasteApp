const { createTicketSchema, updateTicketSchema } = require("./model");
const Repository = require("./repository");
const { InvalidArgumentError, NotFoundError } = require("../common/service_errors");

// Fonction de création d'un ticket
async function createOne(ticket) {
    const { value, error } = createTicketSchema.validate(ticket);
    if (error) {
        throw error;
    }

    return await Repository.createOne(value);
}

// Fonction de récupération d'un ticket par ID
async function getOne(id) {
    const ticket = await Repository.getOne(id);
    if (!ticket) {
        throw new NotFoundError(`Ticket avec l'id ${id} non trouvé`);
    }
    return ticket;
}

// Fonction de récupération de tous les tickets
async function getAll() {
    return await Repository.getAll();
}

// Fonction de mise à jour d'un ticket
async function updateOne(id, ticket) {
    const { value, error } = updateTicketSchema.validate(ticket);
    if (error) {
        throw error;
    }

    const updated = await Repository.updateOne(id, value);
    if (!updated) {
        throw new NotFoundError(`Ticket avec l'id ${id} non trouvé`);
    }
    return updated;
}

// Fonction de suppression d'un ticket
async function deleteOne(id) {
    const deleted = await Repository.deleteOne(id);
    if (!deleted) {
        throw new NotFoundError(`Ticket avec l'id ${id} non trouvé`);
    }
    return deleted;
}

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
