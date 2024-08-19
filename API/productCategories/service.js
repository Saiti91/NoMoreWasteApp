const { createCategorySchema, updateCategorySchema } = require("./model");
const categoryRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'une catégorie de produit
async function createOne(category) {
    // Validate the category data
    const { error } = createCategorySchema.validate(category);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Create the category
    await categoryRepository.createOne(category);
}

// Fonction de récupération d'une catégorie de produit en fonction de son ID
async function getOne(id) {
    const category = await categoryRepository.getOne(id);
    return category ? { ...category } : null;
}

// Fonction de récupération d'une catégorie de produit en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const category = await categoryRepository.getOneBy(attribute, value);
    return category ? { ...category } : null;
}

// Fonction de récupération de toutes les catégories de produits
async function getAll() {
    const categories = await categoryRepository.getAll();
    console.log('Categories from service:', categories);

    // Convertir l'objet en tableau
    return categories;
}

// Fonction de mise à jour d'une catégorie de produit en fonction de son ID
async function updateOne(id, categoryData) {
    const existing = await categoryRepository.getOne(id);
    if (!existing) {
        throw new Error(`Category with ID ${id} does not exist`);
    }

    // Validate the category data
    const { error } = updateCategorySchema.validate(categoryData);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Update the category
    const updated = await categoryRepository.updateOne(id, categoryData);
    return updated ? { ...updated } : null;
}

// Fonction de suppression d'une catégorie de produit
async function deleteOne(id, issuer) {
    const category = await categoryRepository.getOne(id);
    if (!category) {
        throw new Error(`Category with ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("Vous ne pouvez pas supprimer une catégorie sans être un administrateur.");
    }
    return await categoryRepository.deleteOne(id);
}

module.exports = { createOne, getOne, getOneBy, getAll, updateOne, deleteOne };
