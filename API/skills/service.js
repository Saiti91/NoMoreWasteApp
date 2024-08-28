const {createSkillSchema, updateSkillSchema} = require("./model");
const Repository = require("./repository");
const {InvalidArgumentError, NotFoundError} = require("../common/service_errors");
const fs = require('fs');
const path = require('path');

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

async function getUnvalidatedSkillsForUser(userId) {
    return await Repository.getUnvalidatedSkillsForUser(userId);
}

// Fonction de récupération d'une compétence en fonction de son ID
async function getOne(id) {
    console.log('From service getOne:id');
    const skill = await Repository.getOne(id);
    if (!skill) {
        throw new NotFoundError(`Compétence avec l'id ${id} non trouvée.`);
    }
    return skill;
}

async function validateUserSkill(userId, skillId) {
    return await Repository.validateUserSkill(userId, skillId);
}

async function getAllUnvalidatedSkills() {
    return await Repository.getAllUnvalidatedSkills();
}

// Fonction de récupération de toutes les compétences
async function getAll() {
    return await Repository.getAll();
}

// Fonction de récupération de toutes les compétences validées pour un utilisateur spécifique
async function getAllForUser(userId) {
    const userSkills = await Repository.getAllForUser(userId);
    console.log('User skills from service:', userSkills);
    console.log('User skills length:', userSkills.length);
    if (userSkills.length === 0) {
        console.error(`No skills found for user with id ${userId}. Throwing NotFoundError.`);
        throw new NotFoundError(`Aucune compétence trouvée pour l'utilisateur avec l'id ${userId}.`);
    }
    return userSkills;
}

//Fonction pour une supprimer une compétence d'un utilisateur
async function deleteSkillForUser(userId, skillId) {
    const deletedSkill = await Repository.deleteSkillForUser(userId, skillId);
    if (!deletedSkill) {
        throw new NotFoundError('Compétence non trouvée pour cet utilisateur');
    }

    const { userId: returnedUserId, skillId: returnedSkillId } = deletedSkill;
    console.log(`Deleted skill for user with id ${returnedUserId} and skill with id ${returnedSkillId}.`);

    const userIdStr = String(returnedUserId);
    const skillIdStr = String(returnedSkillId);

    const fileExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

    // Iterate over each file extension and attempt to delete the corresponding file
    fileExtensions.forEach(extension => {
        const documentPath = path.join(__dirname, '../uploads/justificatif', userIdStr, `${skillIdStr}${extension}`);
        console.log(`Checking path: ${documentPath}`);

        // Lowercase the documentPath and compare with lowercase directory content (only for debugging)
        const directory = path.join(__dirname, '../uploads/justificatif', userIdStr);
        fs.readdirSync(directory).forEach(file => {
            if (file.toLowerCase() === `${skillIdStr}${extension}`.toLowerCase()) {
                const exactDocumentPath = path.join(directory, file);
                console.log(`Exact file found: ${exactDocumentPath}`);
                fs.unlinkSync(exactDocumentPath);
                console.log(`Document for skill ${skillIdStr} with extension ${extension} deleted successfully.`);
            }
        });
    });

    return { userId: returnedUserId, skillId: returnedSkillId };
}

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

//Ajouter une compétence à un utilisateur
async function addSkillForUser(userId, skillId, documentPath) {
    // Ajouter la compétence pour l'utilisateur
    const result = await Repository.addSkillForUser(userId, skillId, documentPath);
    if (!result) {
        throw new Error('Failed to add skill for user.');
    }

    return {
        message: 'Skill added successfully',
        skillId: skillId,
        documentPath: documentPath,
    };
}


module.exports = {createOne, getOne, getAll, getAllUnvalidatedSkills, validateUserSkill, getUnvalidatedSkillsForUser, getAllForUser, updateOne, deleteOne, deleteSkillForUser, addSkillForUser};
