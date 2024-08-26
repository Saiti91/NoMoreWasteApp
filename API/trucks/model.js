const Joi = require('joi');

// Schéma de validation pour créer un camion (Truck)
const createTruckSchema = Joi.object({
    Registration: Joi.string().max(50).required(),
    Capacity: Joi.number().integer().required(),
    Model: Joi.string().max(100).required(),
    Conditions: Joi.number().integer().min(1).max(5).required()
});

// Schéma de validation pour mettre à jour un camion (Truck)
const updateTruckSchema = Joi.object({
    Truck_ID: Joi.number().integer().optional(),
    Registration: Joi.string().max(50).optional(),
    Capacity: Joi.number().integer().optional(),
    Model: Joi.string().max(100).optional(),
    Conditions: Joi.number().integer().min(1).max(5).optional()
}).min(1); // Assurez-vous qu'au moins un champ est mis à jour

module.exports = { createTruckSchema, updateTruckSchema };
