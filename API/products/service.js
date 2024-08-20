const { createProductSchema, updateProductSchema } = require("./model");
const productRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'un produit
async function createOne(product) {
    // Validate the product data
    const { error } = createProductSchema.validate(product);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Create the product and get the ID
    const productId = await productRepository.createOne(product);

    // Return the ID
    return { Product_ID: productId };
}


// Fonction de récupération d'un produit en fonction de son ID
async function getOne(id) {
    const product = await productRepository.getOne(id);
    return product ? { ...product } : null;
}

// Fonction de récupération d'un produit en fonction d'un attribut
async function getOneBy(attribute, value) {
    if (attribute === undefined || value === undefined) {
        throw new Error("getOneBy: Both attribute and value must be defined");
    }
    const product = await productRepository.getOneBy(attribute, value);
    return product ? { ...product } : null;
}

// Fonction de récupération de tous les produits
async function getAll() {
    const products = await productRepository.getAll();
    console.log('Products from service:', products);

    // Convertir l'objet en tableau
    return products;
}

// Fonction de mise à jour d'un produit en fonction de son ID
async function updateOne(id, productData) {
    const existing = await productRepository.getOne(id);
    if (!existing) {
        throw new Error(`Product with ID ${id} does not exist`);
    }

    // Validate the product data
    const { error } = updateProductSchema.validate(productData);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Update the product
    const updated = await productRepository.updateOne(id, productData);
    return updated ? { ...updated } : null;
}

// Fonction de suppression d'un produit
async function deleteOne(id, issuer) {
    const product = await productRepository.getOne(id);
    if (!product) {
        throw new Error(`Product with ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("Vous ne pouvez pas supprimer un produit sans être un administrateur.");
    }
    return await productRepository.deleteOne(id);
}

module.exports = { createOne, getOne, getOneBy, getAll, updateOne, deleteOne };
