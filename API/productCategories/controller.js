const { Router } = require("express");
const categoriesService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategory:
 *       type: object
 *       required:
 *         - Name
 *       properties:
 *         Category_ID:
 *           type: integer
 *           description: The auto-generated ID of the category
 *         Name:
 *           type: string
 *           description: The name of the category
 *         StorageSector:
 *           type: string
 *           description: The storage sector for the category
 *       example:
 *         Category_ID: 1
 *         Name: "Fruits et Légumes"
 *         StorageSector: "Refrigerated"
 */

/**
 * @swagger
 * tags:
 *   name: ProductsCategories
 *   description: Product categories management
 */

/**
 * @swagger
 * /productsCategories:
 *   get:
 *     summary: Get all product categories
 *     tags: [ProductsCategories]
 *     responses:
 *       200:
 *         description: List of all product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductCategory'
 */
controller.get(
    "/",
    (req, res, next) => {
        categoriesService.getAll()
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /productsCategories/{id}:
 *   get:
 *     summary: Get a product category by ID
 *     tags: [ProductsCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category details by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategory'
 *       404:
 *         description: Category not found
 */
controller.get(
    "/:id",
    (req, res, next) => {
        categoriesService.getOne(Number(req.params.id))
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Category with ID ${req.params.id} not found`);
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /productsCategories:
 *   post:
 *     summary: Create a new product category
 *     tags: [ProductsCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCategory'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategory'
 *       400:
 *         description: Invalid input
 */
controller.post(
    "/",
    (req, res, next) => {
        categoriesService.createOne(req.body)
            .then((data) => res.status(201).json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /productsCategories/{id}:
 *   delete:
 *     summary: Delete a product category by ID
 *     tags: [ProductsCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
controller.delete(
    "/:id",
    authorize(["admin"]),
    (req, res, next) => {
        categoriesService.deleteOne(Number(req.params.id), req.user)
            .then((deleted) => {
                if (!deleted) {
                    throw new NotFoundError(`Category with ID ${req.params.id} not found`);
                }
                res.status(204).json();
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /productsCategories/{id}:
 *   patch:
 *     summary: Update a product category by ID
 *     tags: [ProductsCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategory'
 *       404:
 *         description: Category not found
 *       400:
 *         description: Invalid input
 */
controller.patch(
    "/:id",
    (req, res, next) => {
        categoriesService.updateOne(Number(req.params.id), req.body)
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Category with ID ${req.params.id} not found`);
                }
                res.status(200).json(data);
            })
            .catch((err) => next(err));
    },
);

module.exports = controller;
