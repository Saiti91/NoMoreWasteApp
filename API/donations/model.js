const Joi = require("joi");

// Schéma de validation pour créer une donation
const createDonationSchema = Joi.object({
    Product_ID: Joi.number().required(),
    Quantity: Joi.number().required(),
    Donor_User: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
    Recipient_User: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
});

// Schéma de validation pour mettre à jour une donation
const updateDonationSchema = Joi.object({
    Quantity: Joi.number().optional(),
    Donor_User: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
    Recipient_User: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
}).min(1);

module.exports = { createDonationSchema, updateDonationSchema };
