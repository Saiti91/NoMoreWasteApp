const Joi = require("joi");

// Schéma de validation pour créer une recette
const createRecipeSchema = Joi.object({
    name: Joi.string().max(255).required(),
    instructions: Joi.string().required(),
    ingredients: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().required(),
            quantity: Joi.number().precision(2).required(),
            unit: Joi.string().max(50).optional(),
            description: Joi.string().max(255).optional(),
        })
    ).required(),
});

// Schéma de validation pour mettre à jour une recette
const updateRecipeSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    instructions: Joi.string().optional(),
    ingredients: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().optional(),
            quantity: Joi.number().precision(2).optional(),
            unit: Joi.string().max(50).optional(),
            description: Joi.string().max(255).optional(),
        })
    ).optional(),
}).min(1); // Assure qu'au moins un champ est présent pour la mise à jour

module.exports = {
    createRecipeSchema,
    updateRecipeSchema,
};
