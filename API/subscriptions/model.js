const Joi = require('joi');

// Schéma de validation pour créer un abonnement
const createSubscriptionSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    end_date: Joi.date().required(),
    amount: Joi.number().precision(2).required(),
    status: Joi.boolean().required(),
});

// Schéma de validation pour mettre à jour un abonnement
const updateSubscriptionSchema = Joi.object({
    end_date: Joi.date().optional(),
    amount: Joi.number().precision(2).optional(),
    status: Joi.boolean().optional(),
}).min(1);

module.exports = {
    createSubscriptionSchema,
    updateSubscriptionSchema,
};
