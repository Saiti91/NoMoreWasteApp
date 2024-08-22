const Joi = require("joi");

// Schéma de validation pour créer un utilisateur classique
const createUserSchema = Joi.object({
    role: Joi.string()
        .valid("admin", "volunteer")
        .default("volunteer"),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    telephone: Joi.string().pattern(/^\+?\d{1,15}$/).optional().allow(null),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postal_code: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});


// Schéma de validation pour mettre à jour un utilisateur
const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    telephone: Joi.string().pattern(/^\+?\d{1,15}$/).optional().allow(null),
    birthdate: Joi.string().optional(),
    address: Joi.object({
        street: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        postal_code: Joi.string().optional(),
        country: Joi.string().optional()
    }).optional()
}).min(1);


module.exports = {
    createUserSchema,
    updateUserSchema,
};
