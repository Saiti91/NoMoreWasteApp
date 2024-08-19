const Joi = require("joi");

// Schéma de validation pour créer un produit
const createProductSchema = Joi.object({
    Barcode: Joi.string().required(),
    Name: Joi.string().required(),
    Category_ID: Joi.number().required(),
});

// Schéma de validation pour mettre à jour un produit
const updateProductSchema = Joi.object({
    Barcode: Joi.string().optional(),
    Name: Joi.string().optional(),
    Category_ID: Joi.number().optional(),
}).min(1);

module.exports = {
    createProductSchema,
    updateProductSchema,
};
