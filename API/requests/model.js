const Joi = require("joi");

// Schéma de validation pour créer une donation
const createRequestSchema = Joi.object({
    Product_ID: Joi.number().required(),
    Quantity: Joi.number().required(),
    User_ID: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
});

// Schéma de validation pour mettre à jour une donation
const updateRequestSchema = Joi.object({
    Quantity: Joi.number().optional(),
    User_ID: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
}).min(1);

module.exports = { createRequestSchema,  updateRequestSchema };
