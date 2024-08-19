const { Router } = require("express");
const productsService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - Barcode
 *         - Name
 *         - Category_ID
 *       properties:
 *         Product_ID:
 *           type: integer
 *           description: The auto-generated ID of the product
 *         Barcode:
 *           type: string
 *           description: The product's barcode
 *         Name:
 *           type: string
 *           description: The name of the product
 *         Category_ID:
 *           type: integer
 *           description: The ID of the category the product belongs to
 *         Category_Name:
 *           type: string
 *           description: The name of the category (joined from the category table)
 *       example:
 *         Product_ID: 1
 *         Barcode: "1234567890123"
 *         Name: "Pomme"
 *         Category_ID: 1
 *         Category_Name: "Fruits et Légumes"
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
controller.get(
    "/",
    (req, res, next) => {
        productsService.getAll()
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product details by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
controller.get(
    "/:id",
    (req, res, next) => {
        productsService.getOne(Number(req.params.id))
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 */
controller.post(
    "/",
    (req, res, next) => {
        productsService.createOne(req.body)
            .then((data) => res.status(201).json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
controller.delete(
    "/:id",
    authorize(["admin"]),
    (req, res, next) => {
        productsService.deleteOne(Number(req.params.id), req.user)
            .then((deleted) => {
                if (!deleted) {
                    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
                }
                res.status(204).json();
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid input
 */
controller.patch(
    "/:id",
    (req, res, next) => {
        productsService.updateOne(Number(req.params.id), req.body)
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
                }
                res.status(200).json(data);
            })
            .catch((err) => next(err));
    },
);

module.exports = controller;
