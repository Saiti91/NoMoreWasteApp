const Joi = require("joi");

// Schéma de validation pour créer une tournée
const createTourSchema = Joi.object({
    Date: Joi.date().required(),
    User_ID: Joi.number().integer().optional().allow(null),
    Truck_ID: Joi.number().integer().required(),
    Type: Joi.boolean().required(), // true pour 'collect', false pour 'distribute'
    Destinations: Joi.array().items(
        Joi.object({
            Address_ID: Joi.number().integer().required(),
            Products: Joi.array().items(
                Joi.object({
                    Product_ID: Joi.number().integer().required(),
                    Quantity: Joi.number().integer().required(),
                })
            ).required(),
        })
    ).required()
});

// Schéma de validation pour mettre à jour une tournée
const updateTourSchema = Joi.object({
    Date: Joi.date(),
    User_ID: Joi.number().integer(),
    Truck_ID: Joi.number().integer(),
    Type: Joi.boolean(),
    Destinations: Joi.array().items(
        Joi.object({
            Address_ID: Joi.number().integer(),
            Products: Joi.array().items(
                Joi.object({
                    Product_ID: Joi.number().integer(),
                    Quantity: Joi.number().integer(),
                })
            )
        })
    )
}).min(1);

module.exports = { createTourSchema, updateTourSchema };
