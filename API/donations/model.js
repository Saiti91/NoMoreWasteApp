const Joi = require("joi");

// Schéma de validation pour créer une donation
const createDonationSchema = Joi.object({
    Product_ID: Joi.number().required(),
    Quantity: Joi.number().required(),
    Donor_User_ID: Joi.number().allow(null).optional(), // Nullable if not provided
    Date: Joi.date().required(),
    Route_ID: Joi.number().allow(null).optional(), // Nullable if not provided
    Collected: Joi.boolean().default(false), // Default value is false
    Collection_Date: Joi.date().allow(null).optional(), // Nullable if not collected yet
});

// Schéma de validation pour mettre à jour une donation
const updateDonationSchema = Joi.object({
    Product_ID: Joi.number().optional(),
    Quantity: Joi.number().optional(),
    Donor_User_ID: Joi.number().allow(null).optional(),
    Date: Joi.date().optional(),
    Route_ID: Joi.number().allow(null).optional(),
    Collected: Joi.boolean().optional(),
    Collection_Date: Joi.date().allow(null).optional(),
}).min(1);

module.exports = { createDonationSchema, updateDonationSchema };
