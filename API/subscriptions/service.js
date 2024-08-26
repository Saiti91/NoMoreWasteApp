const { createSubscriptionSchema, updateSubscriptionSchema } = require("./SubscriptionModel");
const Repository = require("./repository");
const UserRepository = require("../users/repository"); // Assurez-vous que ce chemin est correct
const { InvalidArgumentError, NotFoundError } = require("../common/service_errors");

async function createSubscription(subscriptionData) {
    const { value, error } = createSubscriptionSchema.validate(subscriptionData);
    if (error) {
        throw error;
    }

    const subscription = await Repository.createOne(value);

    // Mettre à jour le statut IsRegistered de l'utilisateur
    if (value.status === true) {
        await UserRepository.updateIsRegistered(value.user_id, true);
    }

    return subscription;
}

async function getSubscription(userId) {
    const subscription = await Repository.getOne(userId);
    if (!subscription) {
        throw new NotFoundError("Subscription not found");
    }
    return subscription;
}

async function updateSubscription(userId, updateData) {
    const { value, error } = updateSubscriptionSchema.validate(updateData);
    if (error) {
        throw error;
    }

    const updated = await Repository.updateOne(userId, value);

    // Mettre à jour le statut IsRegistered de l'utilisateur si nécessaire
    if (value.status !== undefined) {
        await UserRepository.updateIsRegistered(userId, value.status);
    }

    return updated;
}

module.exports = {
    createSubscription,
    getSubscription,
    updateSubscription,
};
