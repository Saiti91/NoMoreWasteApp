const Joi = require('joi');

// Schéma de validation pour créer un diplôme
const createDiplomaSchema = Joi.object({
    name: Joi.string().max(100).required()
});

// Schéma de validation pour mettre à jour un diplôme
const updateDiplomaSchema = Joi.object({
    name: Joi.string().max(100).optional()
}).min(1);

module.exports = {
    createDiplomaSchema,
    updateDiplomaSchema,
};
