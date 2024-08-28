const Joi = require("joi");

// Schéma de validation pour créer une adresse
const createAddressSchema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().required()
});

// Schéma de validation pour mettre à jour une adresse
const updateAddressSchema = Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    postal_code: Joi.string().optional(),
    country: Joi.string().optional()
}).min(1);

module.exports = {
    createAddressSchema,
    updateAddressSchema,
};
