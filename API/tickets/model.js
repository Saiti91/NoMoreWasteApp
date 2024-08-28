const Joi = require('joi');

// Schéma de validation pour créer un ticket
const createTicketSchema = Joi.object({
    title: Joi.string().required(),
    direction: Joi.boolean().required(),
    categoryId: Joi.number().integer().required(),
    startDate: Joi.date().iso().required(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Nouveau champ pour l'heure de début
    duration: Joi.number().integer().min(1).required(),
    places: Joi.number().integer().optional().allow(null),
    tools: Joi.string().optional().allow(null),
    addressId: Joi.number().integer().optional().allow(null),
    needsCustomerAddress: Joi.boolean().default(false),
    description: Joi.string().optional().allow(''),
    image: Joi.any().optional().allow(null),
    skillId: Joi.number().integer().optional().allow(null) // Nouveau champ pour la compétence
});

const updateTicketSchema = Joi.object({
    title: Joi.string().optional(),
    direction: Joi.boolean().optional(),
    categoryId: Joi.number().integer().optional(),
    startDate: Joi.date().iso().optional(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(), // Nouveau champ pour l'heure de début
    duration: Joi.number().integer().min(1).optional(),
    places: Joi.number().integer().optional().allow(null),
    tools: Joi.string().optional().allow(null),
    addressId: Joi.number().integer().optional().allow(null),
    needsCustomerAddress: Joi.boolean().optional(),
    description: Joi.string().optional().allow(''),
    image: Joi.any().optional().allow(null),
    skillId: Joi.number().integer().optional().allow(null) // Nouveau champ pour la compétence
}).min(1);

module.exports = {
    createTicketSchema,
    updateTicketSchema,
};
