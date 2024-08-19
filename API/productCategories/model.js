const Joi = require("joi");

// Schéma de validation pour créer une catégorie de produit
const createCategorySchema = Joi.object({
    Name: Joi.string().required(),
    StorageSector: Joi.string().optional(),  // Optional field for StorageSector
});

// Schéma de validation pour mettre à jour une catégorie de produit
const updateCategorySchema = Joi.object({
    Name: Joi.string().optional(),
    StorageSector: Joi.string().optional(),
}).min(1);

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
