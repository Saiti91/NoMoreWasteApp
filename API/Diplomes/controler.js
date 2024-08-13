const { Router } = require('express');
const diplomaService = require('../services/DiplomaService');
const NotFoundError = require('../common/http_errors').NotFoundError;
const { createDiplomaSchema, updateDiplomaSchema } = require('../models/validation/diplomaValidation');

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Diploma:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the diploma.
 *         name:
 *           type: string
 *           description: The name of the diploma.
 *       example:
 *         id: 1
 *         name: "Driving License B1"
 */

/**
 * @swagger
 * tags:
 *   name: Diplomas
 *   description: Diploma management
 */

/**
 * @swagger
 * /diplomas:
 *   get:
 *     summary: Retrieve a list of diplomas
 *     tags: [Diplomas]
 *     responses:
 *       200:
 *         description: A list of diplomas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Diploma'
 */
controller.get('/', (req, res, next) => {
    diplomaService.getAll()
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /diplomas/{id}:
 *   get:
 *     summary: Get a diploma by ID
 *     tags: [Diplomas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The diploma ID
 *     responses:
 *       200:
 *         description: A single diploma.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diploma'
 *       404:
 *         description: Diploma not found
 */
controller.get('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    diplomaService.getOne(id)
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Diploma with id ${id} not found`);
            }
            res.json(data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /diplomas:
 *   post:
 *     summary: Create a new diploma
 *     tags: [Diplomas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Diploma'
 *     responses:
 *       201:
 *         description: The created diploma.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diploma'
 */
controller.post('/', (req, res, next) => {
    const { error } = createDiplomaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    diplomaService.createOne(req.body)
        .then((data) => res.status(201).json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /diplomas/{id}:
 *   delete:
 *     summary: Delete a diploma by ID
 *     tags: [Diplomas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The diploma ID
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Diploma not found
 */
controller.delete('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    diplomaService.deleteOne(id)
        .then((deletedId) => {
            if (deletedId === null) {
                throw new NotFoundError(`Diploma with id ${id} not found`);
            }
            res.status(204).json();
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /diplomas/{id}:
 *   patch:
 *     summary: Update a diploma by ID
 *     tags: [Diplomas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The diploma ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Diploma'
 *     responses:
 *       200:
 *         description: The updated diploma.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diploma'
 *       404:
 *         description: Diploma not found
 */
controller.patch('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    const { error } = updateDiplomaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    diplomaService.updateOne(id, req.body)
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Diploma with id ${id} not found`);
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));
});

module.exports = controller;
