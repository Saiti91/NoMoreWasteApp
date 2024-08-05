const { createUserSchema, updateUserSchema } = require("./model");
const Repository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'utilisateur
async function createOne(user) {
    const { value, error } = createUserSchema.validate(user);
    if (error) {
        throw error;
    }

    if (await Repository.getOneBy("Email", value.email)) {
        throw new InvalidArgumentError("Cet email est déjà utilisé.");
    }

    const newUser = await Repository.createOne(value);
    return { ...newUser, password: "[redacted]" };
}

// Fonction de récupération d'un utilisateur en fonction de son ID
async function getOne(id, issuer) {
    if (["volunteer"].includes(issuer.role) && issuer.id !== id) {
        throw new UnauthorizedError("Vous ne pouvez voir que votre propre compte.");
    }

    const user = await Repository.getOne(id);
    return user ? { ...user, password: "[redacted]" } : null;
}

// Fonction de récupération de tous les utilisateurs
async function getAll() {
    const users = await Repository.getAll();
    return users.map(user => ({ ...user, password: "[redacted]" }));
}

// Fonction de mise à jour d'un utilisateur en fonction de son ID
async function updateOne(id, user, issuer) {
    if (["volunteer"].includes(issuer.role) && issuer.id !== id) {
        throw new UnauthorizedError("Vous ne pouvez mettre à jour que votre propre compte.");
    }

    const { value, error } = updateUserSchema.validate(user);
    if (error) {
        throw error;
    }

    const existingUser = await Repository.getOneBy("Email", value.email);
    if (existingUser && existingUser.User_ID !== id) {
        throw new InvalidArgumentError("Cet email est déjà utilisé.");
    }

    const updatedUser = await Repository.updateOne(id, value);
    return updatedUser ? { ...updatedUser, password: "[redacted]" } : null;
}

// Fonction de suppression d'un utilisateur
async function deleteOne(id, issuer) {
    if (["customer", "owner", "provider"].includes(issuer.role) && issuer.id !== id) {
        throw new UnauthorizedError("Vous ne pouvez supprimer que votre propre compte.");
    }

    const user = await Repository.getOne(id);
    if (user?.role === "admin") {
        throw new UnauthorizedError("Vous ne pouvez pas supprimer le compte d'un administrateur.");
    }

    return await Repository.deleteOne(id);
}

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
