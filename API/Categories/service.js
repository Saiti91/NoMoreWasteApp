const { createCategorySchema, updateCategorySchema } = require("./model");
const CategoryRepository = require("../repositories/CategoryRepository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'une catégorie
async function createOne(category) {
    const { value, error } = createCategorySchema.validate(category);
    if (error) {
        throw error;
    }

    // Vérifier si la catégorie existe déjà avec le même nom et le même diplôme
    if (await CategoryRepository.getOneBy("Name", value.name) && value.diploma_id) {
        throw new InvalidArgumentError("Une catégorie avec ce nom existe déjà pour ce diplôme.");
    }

    const newCategory = await CategoryRepository.createOne(value);
    return newCategory;
}

// Fonction de récupération d'une catégorie en fonction de son ID
async function getOne(id) {
    const category = await CategoryRepository.getOne(id);
    return category || null;
}

// Fonction de récupération de toutes les catégories
async function getAll() {
    const categories = await CategoryRepository.getAll();
    return categories;
}

// Fonction de mise à jour d'une catégorie en fonction de son ID
async function updateOne(id, category) {
    const { value, error } = updateCategorySchema.validate(category);
    if (error) {
        throw error;
    }

    // Vérifier si la catégorie existe déjà avec le même nom et le même diplôme
    const existingCategory = await CategoryRepository.getOne(id);
    if (existingCategory && value.name) {
        const duplicateCategory = await CategoryRepository.getOneBy("Name", value.name);
        if (duplicateCategory && duplicateCategory.Category_ID !== id) {
            throw new InvalidArgumentError("Une catégorie avec ce nom existe déjà pour ce diplôme.");
        }
    }

    const updatedCategory = await CategoryRepository.updateOne(id, value);
    return updatedCategory ? { ...updatedCategory } : null;
}

// Fonction de suppression d'une catégorie
async function deleteOne(id) {
    const category = await CategoryRepository.getOne(id);
    if (!category) {
        throw new InvalidArgumentError("La catégorie à supprimer n'existe pas.");
    }

    return await CategoryRepository.deleteOne(id);
}

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
