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
    telephone: Joi.string().pattern(/^\+?\d{1,15}$/).optional()
});

// Schéma de validation pour mettre à jour un utilisateur
const updateUserSchema = Joi.object({
    users_id: Joi.number().integer().required(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    telephone: Joi.string().pattern(/^\+?\d{1,15}$/).optional(),
}).min(1);

module.exports = {
    createUserSchema,
    updateUserSchema,
};
