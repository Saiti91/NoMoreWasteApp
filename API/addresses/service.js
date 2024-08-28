const { createAddressSchema, updateAddressSchema } = require('./model');
const Repository = require('./repository');
const { InvalidArgumentError, NotFoundError } = require('../common/service_errors');

// Fonction de création d'une nouvelle adresse
async function createOne(address) {
    const { value, error } = createAddressSchema.validate(address);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }
    return await Repository.createOne(value);
}

// Fonction de récupération d'une adresse par ID
async function getOne(id) {
    const address = await Repository.getOne(id);
    if (!address) {
        throw new NotFoundError("Adresse non trouvée.");
    }
    return address;
}

// Fonction de récupération de toutes les adresses
async function getAll() {
    return await Repository.getAll();
}

// Fonction de mise à jour d'une adresse
async function updateOne(id, address) {
    const { value, error } = updateAddressSchema.validate(address);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }
    const updated = await Repository.updateOne(id, value);
    if (!updated) {
        throw new NotFoundError("Adresse non trouvée pour la mise à jour.");
    }
    return await Repository.getOne(id);
}

// Fonction de suppression d'une adresse
async function deleteOne(id) {
    const deleted = await Repository.deleteOne(id);
    if (!deleted) {
        throw new NotFoundError("Adresse non trouvée pour la suppression.");
    }
}

module.exports = {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne
};
