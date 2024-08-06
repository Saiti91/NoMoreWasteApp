const Joi = require("joi");

// Schéma de validation pour créer un stock
const createStockSchema = Joi.object({
    Product_ID: Joi.number().required(),
    Quantity: Joi.number().optional(),
});

// Schéma de validation pour mettre à jour un stock
const updateStockSchema = Joi.object({
    Product_ID: Joi.number().required(),
    Quantity: Joi.number().required(),
    Storage_Date: Joi.date().optional()
}).min(1);

module.exports = {
    createStockSchema,
    updateStockSchema,
};
