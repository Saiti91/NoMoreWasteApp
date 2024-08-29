const Joi = require("joi");

// Schéma de validation pour créer une tournée
const createTourSchema = Joi.object({
    Date: Joi.date().required(),
    Time: Joi.string().pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/).required(),
    User_ID: Joi.number().integer().optional().allow(null),
    Truck_ID: Joi.number().integer().required(),
    Type: Joi.boolean().required(), // true pour 'collect', false pour 'distribute'
    Destinations: Joi.array().items(
        Joi.object({
            Address_ID: Joi.number().integer().required(),
            Products: Joi.array().items(
                Joi.object({
                    Donation_ID: Joi.number().integer().required(),
                    Product_ID: Joi.number().integer().required(),
                    Quantity: Joi.number().integer().required(),
                })
            ).required(),
        })
    ).required()
});


// Schéma de validation pour mettre à jour une tournée
const updateTourSchema = Joi.object({
    Date: Joi.date().optional().allow(null),
    User_ID: Joi.number().integer().optional().allow(null),
    Truck_ID: Joi.number().integer().optional().allow(null),
    Type: Joi.boolean().optional().allow(null),
    Destinations: Joi.array().items(
        Joi.object({
            Address_ID: Joi.number().integer().optional().allow(null),
            Products: Joi.array().items(
                Joi.object({
                    Product_ID: Joi.number().integer().optional().allow(null),
                    Quantity: Joi.number().integer().optional().allow(null),
                })
            ).optional().allow(null)
        })
    ).optional().allow(null)
}).min(1);


module.exports = { createTourSchema, updateTourSchema };
