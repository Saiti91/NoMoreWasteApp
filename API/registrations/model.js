const Joi = require("joi");

// Schéma de validation pour créer une inscription à un ticket
const createRegistrationSchema = Joi.object({
    Ticket_ID: Joi.number().integer().required(),
    User_ID: Joi.number().integer().required(),
});


module.exports = {
    createRegistrationSchema,
};
