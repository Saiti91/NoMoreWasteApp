// Importation du module Joi pour la validation de données
const Joi = require("joi");

// Définition du schéma de validation pour le formulaire de connexion
const loginSchema = Joi.object({
    email: Joi.string().email().required(),  // L'email doit être une chaîne valide et respecter le format d'email
    password: Joi.string().required(),       // Le mot de passe est requis et doit être une chaîne
});

// Définition du schéma de validation pour le formulaire d'inscription
const registerSchema = Joi.object({
    email: Joi.string().email().required(),        // L'email doit être valide et est requis
    password: Joi.string().required(),             // Le mot de passe est requis
    firstname: Joi.string().required(),            // Le prénom est requis
    name: Joi.string().required(),                 // Le nom de famille est requis
    address: Joi.object({                          // L'adresse est un objet qui contient plusieurs champs
        street: Joi.string().required(),           // La rue est requise
        city: Joi.string().required(),             // La ville est requise
        state: Joi.string().required(),            // L'état est requis
        postal_code: Joi.string().required(),      // Le code postal est requis
        country: Joi.string().required()           // Le pays est requis
    }).required()                                  // L'adresse entière est requise
});


// Exportation des schémas pour utilisation dans d'autres parties de l'application
module.exports = {
    loginSchema,
    registerSchema,
};
