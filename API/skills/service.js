const { createSkillSchema, updateSkillSchema } = require("./model");
const Repository = require("./repository");
const { InvalidArgumentError, NotFoundError } = require("../common/service_errors");

// Fonction de création d'une compétence
async function createOne(skill) {
    const { value, error } = createSkillSchema.validate(skill);
    if (error) {
        throw error;
    }

    // Vérifier si une compétence avec le même nom existe déjà
    if (await Repository.getOneBy("Name", value.name)) {
        throw new InvalidArgumentError("Une compétence avec ce nom existe déjà.");
    }

    return await Repository.createOne(value);
}

// Fonction de récupération d'une compétence en fonction de son ID
async function getOne(id) {
    const skill = await Repository.getOne(id);
    if (!skill) {
        throw new NotFoundError(`Compétence avec l'id ${id} non trouvée.`);
    }
    return skill;
}

// Fonction de récupération de toutes les compétences
async function getAll() {
    return await Repository.getAll();
}

// Fonction de récupération de toutes les compétences validées pour un utilisateur spécifique
async function getAllForUser(userId) {
    const userSkills = await Repository.getAllForUser(userId);
    if (!userSkills.length) {
        throw new NotFoundError(`Aucune compétence trouvée pour l'utilisateur avec l'id ${userId}.`);
    }
    return userSkills;
}

// Fonction de mise à jour d'une compétence en fonction de son ID
async function updateOne(id, skill) {
    const { value, error } = updateSkillSchema.validate(skill);
    if (error) {
        throw error;
    }

    const currentSkill = await Repository.getOne(id);
    if (!currentSkill) {
        throw new NotFoundError(`Compétence avec l'id ${id} non trouvée.`);
    }

    // Vérifier si une compétence avec le même nom existe déjà
    if (value.name && value.name !== currentSkill.Name) {
        const existingSkill = await Repository.getOneBy("Name", value.name);
        if (existingSkill) {
            throw new InvalidArgumentError("Une compétence avec ce nom existe déjà.");
        }
    }

    const updatedSkillData = {
        ...currentSkill,
        ...value
    };

    return await Repository.updateOne(id, updatedSkillData);
}

// Fonction de suppression d'une compétence
async function deleteOne(id) {
    const skill = await Repository.getOne(id);
    if (!skill) {
        throw new NotFoundError(`Compétence avec l'id ${id} non trouvée.`);
    }

    return await Repository.deleteOne(id);
}

module.exports = { createOne, getOne, getAll, getAllForUser, updateOne, deleteOne };
