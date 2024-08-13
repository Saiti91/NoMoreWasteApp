const { createDiplomaSchema, updateDiplomaSchema } = require("./model");
const DiplomaRepository = require("../repositories/DiplomaRepository");
const { InvalidArgumentError } = require("../common/service_errors");

// Fonction de création d'un diplôme
async function createOne(diploma) {
    const { value, error } = createDiplomaSchema.validate(diploma);
    if (error) {
        throw error;
    }

    // Vérifier si le diplôme existe déjà avec le même nom
    if (await DiplomaRepository.getOneBy("Name", value.name)) {
        throw new InvalidArgumentError("Un diplôme avec ce nom existe déjà.");
    }

    const newDiploma = await DiplomaRepository.createOne(value);
    return newDiploma;
}

// Fonction de récupération d'un diplôme en fonction de son ID
async function getOne(id) {
    const diploma = await DiplomaRepository.getOne(id);
    return diploma || null;
}

// Fonction de récupération de tous les diplômes
async function getAll() {
    const diplomas = await DiplomaRepository.getAll();
    return diplomas;
}

// Fonction de mise à jour d'un diplôme en fonction de son ID
async function updateOne(id, diploma) {
    const { value, error } = updateDiplomaSchema.validate(diploma);
    if (error) {
        throw error;
    }

    // Vérifier si le diplôme existe déjà avec le même nom
    const existingDiploma = await DiplomaRepository.getOne(id);
    if (existingDiploma && value.name) {
        const duplicateDiploma = await DiplomaRepository.getOneBy("Name", value.name);
        if (duplicateDiploma && duplicateDiploma.Diploma_ID !== id) {
            throw new InvalidArgumentError("Un diplôme avec ce nom existe déjà.");
        }
    }

    const updatedDiploma = await DiplomaRepository.updateOne(id, value);
    return updatedDiploma ? { ...updatedDiploma } : null;
}

// Fonction de suppression d'un diplôme
async function deleteOne(id) {
    const diploma = await DiplomaRepository.getOne(id);
    if (!diploma) {
        throw new InvalidArgumentError("Le diplôme à supprimer n'existe pas.");
    }

    return await DiplomaRepository.deleteOne(id);
}

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
