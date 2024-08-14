const Joi = require("joi");

// Schéma de validation pour créer un ticket
const createTicketSchema = Joi.object({
    title: Joi.string().required(),
    direction: Joi.boolean().required(),
    category_id: Joi.number().integer().required(),
    start_date: Joi.date().required(),
    duration: Joi.number().integer().required(),
    places: Joi.number().integer().required(),
    tools: Joi.string().optional().allow(null),
    address_id: Joi.number().integer().required(),
    address_needs: Joi.boolean().required(),
    customers_address: Joi.string().optional().allow(null),
    description: Joi.string().optional().allow(null),
    image: Joi.string().optional().allow(null),
    status_id: Joi.number().integer().required(),
    owner_id: Joi.number().integer().required(),
});

// Schéma de validation pour mettre à jour un ticket
const updateTicketSchema = Joi.object({
    title: Joi.string().optional(),
    direction: Joi.boolean().optional(),
    category_id: Joi.number().integer().optional(),
    start_date: Joi.date().optional(),
    duration: Joi.number().integer().optional(),
    places: Joi.number().integer().optional(),
    tools: Joi.string().optional().allow(null),
    address_id: Joi.number().integer().optional(),
    address_needs: Joi.boolean().optional(),
    customers_address: Joi.string().optional().allow(null),
    description: Joi.string().optional().allow(null),
    image: Joi.string().optional().allow(null),
    status_id: Joi.number().integer().optional(),
    owner_id: Joi.number().integer().optional(),
}).min(1);

module.exports = {
    createTicketSchema,
    updateTicketSchema,
};
