const Joi = require('joi');

// Schéma de validation pour créer une catégorie
const createCategorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    Skill_id: Joi.number().integer().required()
});

// Schéma de validation pour mettre à jour une catégorie
const updateCategorySchema = Joi.object({
    Category_ID: Joi.number().required(),
    name: Joi.string().max(100).optional(),
}).min(1);

// Schéma de validation pour ajouter des compétences à une catégorie
const addSkillsToCategorySchema = Joi.object({
    Category_ID: Joi.number().integer().required(),
    Skill_id: Joi.array().items(Joi.number().integer()).required()
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
    addSkillsToCategorySchema,
};
