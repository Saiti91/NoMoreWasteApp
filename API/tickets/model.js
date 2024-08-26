const Joi = require('joi');

// Schéma de validation pour créer un ticket
const createTicketSchema = Joi.object({
    title: Joi.string().required(),
    direction: Joi.boolean().required(),  // true for 'Proposer', false for 'Demander'
    categoryId: Joi.number().integer().required(),  // Assuming categories are referenced by IDs
    startDate: Joi.date().iso().required(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    duration: Joi.number().integer().min(1).required(),  // Assuming duration in minutes
    places: Joi.number().integer().optional().allow(null),  // Optional, numeric
    tools: Joi.string().optional().allow(null),  // Optional tools description
    addressId: Joi.number().integer().optional().allow(null),  // Optional, foreign key reference to Address
    needsCustomerAddress: Joi.boolean().default(false),
    description: Joi.string().optional().allow(''),
    image: Joi.any().optional().allow(null),  // Optional image upload
});

// Schéma de validation pour mettre à jour un ticket
const updateTicketSchema = Joi.object({
    title: Joi.string().optional(),
    direction: Joi.boolean().optional(),  // true for 'Proposer', false for 'Demander'
    categoryId: Joi.number().integer().optional(),  // Category ID as an integer
    startDate: Joi.date().iso().optional(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    duration: Joi.number().integer().min(1).optional(),  // Duration in minutes
    places: Joi.number().integer().optional().allow(null),  // Optional, numeric
    tools: Joi.string().optional().allow(null),  // Optional tools description
    addressId: Joi.number().integer().optional().allow(null),  // Optional, foreign key reference to Address
    needsCustomerAddress: Joi.boolean().optional(),
    description: Joi.string().optional().allow(''),
    image: Joi.any().optional().allow(null)  // Optional image upload
}).min(1); // Require at least one field to be updated

module.exports = {
    createTicketSchema,
    updateTicketSchema,
};
