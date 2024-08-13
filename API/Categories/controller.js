const { Router } = require('express');
const categoryService = require('./service');
const NotFoundError = require('../common/http_errors').NotFoundError;
const authorize = require('../common/middlewares/authorize_middleware');
const { createCategorySchema, updateCategorySchema } = require('./model');

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - diploma_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the category.
 *         name:
 *           type: string
 *           description: The name of the category.
 *         diploma_id:
 *           type: integer
 *           description: The ID of the related diploma.
 *       example:
 *         id: 1
 *         name: "Mathematics"
 *         diploma_id: 2
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
controller.get('/', (req, res, next) => {
    categoryService.getAll()
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: A single category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
controller.get('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    categoryService.getOne(id)
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Category with id ${id} not found`);
            }
            res.json(data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: The created category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
controller.post('/', (req, res, next) => {
    const { error } = createCategorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    categoryService.createOne(req.body)
        .then((data) => res.status(201).json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Category not found
 */
controller.delete('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    categoryService.deleteOne(id)
        .then((deletedId) => {
            if (deletedId === null) {
                throw new NotFoundError(`Category with id ${id} not found`);
            }
            res.status(204).json();
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category by ID
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The updated category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
controller.patch('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    const { error } = updateCategorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    categoryService.updateOne(id, req.body)
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Category with id ${id} not found`);
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));
});

module.exports = controller;
