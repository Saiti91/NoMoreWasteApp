const Joi = require('joi');

// Schéma de validation pour créer une catégorie
const createCategorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    diploma_id: Joi.number().integer().required() // Changement de 'Skill_id' en 'diploma_id' pour correspondre aux colonnes de la base de données
});

// Schéma de validation pour mettre à jour une catégorie
const updateCategorySchema = Joi.object({
    name: Joi.string().max(100).optional(),
    diploma_id: Joi.number().integer().optional() // Assurez-vous que 'diploma_id' est optionnel pour la mise à jour
}).min(1);

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
