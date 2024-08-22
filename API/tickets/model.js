// models/ticketModel.js

const Joi = require('joi');

// Schéma de validation pour créer un ticket
const createTicketSchema = Joi.object({
    title: Joi.string().required(),
    propose: Joi.string().valid('Proposer', 'Demander').required(),
    category: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    duration: Joi.string().max(3).required(),
    format: Joi.string().valid('Minutes', 'Heures', 'Jours').required(),
    places: Joi.string().max(3).optional().allow(''),
    tools: Joi.string().valid('Aucun', 'Autre').optional(),
    toolsOther: Joi.string().optional().allow(''),
    extraTools: Joi.array().items(Joi.string()).optional().default([]),
    address: Joi.string().optional().allow(''),
    needsCustomerAddress: Joi.boolean().default(false),
    description: Joi.string().optional().allow(''),
    image: Joi.any().optional()
});

// Schéma de validation pour mettre à jour un ticket
const updateTicketSchema = Joi.object({
    title: Joi.string().optional(),
    propose: Joi.string().valid('Proposer', 'Demander').optional(),
    category: Joi.string().optional(),
    startDate: Joi.date().iso().optional(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    duration: Joi.string().max(3).optional(),
    format: Joi.string().valid('Minutes', 'Heures', 'Jours').optional(),
    places: Joi.string().max(3).optional().allow(''),
    tools: Joi.string().valid('Aucun', 'Autre').optional(),
    toolsOther: Joi.string().optional().allow(''),
    extraTools: Joi.array().items(Joi.string()).optional(),
    address: Joi.string().optional().allow(''),
    needsCustomerAddress: Joi.boolean().optional(),
    description: Joi.string().optional().allow(''),
    image: Joi.any().optional()
}).min(1); // Require at least one field to be updated

module.exports = {
    createTicketSchema,
    updateTicketSchema,
};
