const { Router } = require('express');
const categoriesService = require('./service');
const NotFoundError = require('../common/http_errors').NotFoundError;
const authorize = require('../common/middlewares/authorize_middleware');
const { createCategorySchema, updateCategorySchema } = require('./model'); // Assurez-vous que ces schémas sont correctement définis.

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the category.
 *         name:
 *           type: string
 *           description: The name of the category.
 *       example:
 *         id: 1
 *         name: Electronics
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
controller.get('/', async (req, res, next) => {
    try {
        const data = await categoriesService.getAll();
        res.json(data);
    } catch (err) {
        next(err);
    }
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
controller.get('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    try {
        const data = await categoriesService.getOne(id);
        if (data === null) {
            throw new NotFoundError(`Category with id ${id} not found`);
        }
        res.json(data);
    } catch (err) {
        next(err);
    }
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
controller.post('/', async (req, res, next) => {
    try {
        const { error } = createCategorySchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const data = await categoriesService.createOne(req.body);
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
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
 *         description: Category deleted successfully.
 *       404:
 *         description: Category not found.
 */
controller.delete('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    try {
        const deletedId = await categoriesService.deleteOne(id);
        if (deletedId === null) {
            throw new NotFoundError(`Category with id ${id} not found`);
        }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
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
 *         description: Category not found.
 */
controller.patch('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    try {
        const { error } = updateCategorySchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const data = await categoriesService.updateOne(id, req.body);
        if (data === null) {
            throw new NotFoundError(`Category with id ${id} not found`);
        }
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = controller;
