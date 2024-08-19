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
        street: Joi.string().required(),          // La rue est requise
        city: Joi.string().required(),            // La ville est requise
        state: Joi.string().required(),           // L'état est requis
        postal_code: Joi.string().required(),     // Le code postal est requis
        country: Joi.string().required()          // Le pays est requis
    }).required()                                // L'adresse entière est requise
});


// Schéma de validation pour mettre à jour un utilisateur
const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    telephone: Joi.string().pattern(/^\+?\d{1,15}$/).optional().allow(null)
}).min(1);

module.exports = {
    createUserSchema,
    updateUserSchema,
};
