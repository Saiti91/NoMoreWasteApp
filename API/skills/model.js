const Joi = require("joi");

// Schéma de validation pour créer une compétence
const createSkillSchema = Joi.object({
    name: Joi.string().max(100).required(),
});

// Schéma de validation pour mettre à jour une compétence
const updateSkillSchema = Joi.object({
    name: Joi.string().max(100).optional(),
}).min(1);

// Schéma de validation pour lier une compétence à un utilisateur
const userSkillSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    skill_id: Joi.number().integer().required(),
    validation_date: Joi.date().optional().allow(null),
    document_path: Joi.string().max(255).optional().allow(null),
});

module.exports = {
    createSkillSchema,
    updateSkillSchema,
    userSkillSchema,
};
