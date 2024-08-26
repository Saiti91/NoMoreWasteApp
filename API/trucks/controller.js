const { Router } = require("express");
const trucksService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Truck:
 *       type: object
 *       properties:
 *         Truck_ID:
 *           type: integer
 *           description: The auto-generated ID of the truck
 *         Registration:
 *           type: string
 *           description: The registration number of the truck
 *         Capacity:
 *           type: integer
 *           description: The capacity of the truck in cubic meters
 *         Model:
 *           type: string
 *           description: The model of the truck
 *         Conditions:
 *           type: integer
 *           description: The condition of the truck (1-5 scale)
 *       required:
 *         - Registration
 *         - Capacity
 *         - Model
 *         - Conditions
 *       example:
 *         Truck_ID: 1
 *         Registration: "ABC123"
 *         Capacity: 20
 *         Model: "Renault"
 *         Conditions: 4
 */

/**
 * @swagger
 * tags:
 *   name: Truck
 *   description: Truck management
 */

/**
 * @swagger
 * /trucks:
 *   get:
 *     summary: Retrieve a list of all trucks
 *     tags: [Truck]
 *     responses:
 *       200:
 *         description: A list of all trucks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Truck'
 */
controller.get("/", (req, res, next) => {
    trucksService.getAllTrucks()
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /trucks/availableToday:
 *   get:
 *     summary: Retrieve a list of trucks available today
 *     tags: [Truck]
 *     responses:
 *       200:
 *         description: A list of trucks available for today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Truck'
 *       404:
 *         description: No trucks available today
 */
controller.get("/availableToday", (req, res, next) => {
    trucksService.getAvailableTrucksToday()
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /trucks/{id}:
 *   get:
 *     summary: Retrieve a truck by ID
 *     tags: [Truck]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the truck
 *     responses:
 *       200:
 *         description: A single truck
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truck'
 *       404:
 *         description: Truck not found
 */
controller.get("/:id", (req, res, next) => {
    trucksService.getOneTruck(Number(req.params.id))
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Truck with ID ${req.params.id} not found`);
            }
            res.json(data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /trucks:
 *   post:
 *     summary: Create a new truck
 *     tags: [Truck]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Truck'
 *     responses:
 *       201:
 *         description: Truck created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truck'
 *       400:
 *         description: Invalid input data
 */
controller.post("/", (req, res, next) => {
    trucksService.createTruck(req.body)
        .then((data) => res.status(201).json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /trucks/{id}:
 *   patch:
 *     summary: Update a truck by ID
 *     tags: [Truck]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the truck
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Truck'
 *     responses:
 *       200:
 *         description: Truck updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truck'
 *       404:
 *         description: Truck not found
 *       400:
 *         description: Invalid input data
 */
controller.patch("/:id", (req, res, next) => {
    const truckId = Number(req.params.id);
    const data = req.body;

    trucksService.updateTruck(truckId, data)
        .then((updatedTruck) => {
            if (!updatedTruck) {
                throw new NotFoundError(`Truck with ID ${req.params.id} not found`);
            }
            res.status(200).json(updatedTruck);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /trucks/{id}:
 *   delete:
 *     summary: Delete a truck by ID
 *     tags: [Truck]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the truck
 *     responses:
 *       204:
 *         description: Truck deleted successfully
 *       404:
 *         description: Truck not found
 *       401:
 *         description: Unauthorized access
 *     security:
 *       - bearerAuth: []
 */
controller.delete("/:id", (req, res, next) => {
    const forceDelete = req.query.force === 'true';

    trucksService.deleteTruck(Number(req.params.id), forceDelete)
        .then((deleted) => {
            if (!deleted) {
                throw new NotFoundError(`Truck with ID ${req.params.id} not found`);
            }
            res.status(204).json();
        })
        .catch((err) => {
            if (err.message.includes("Cannot delete truck with ID")) {
                res.status(400).json({ error: err.message });
            } else {
                next(err);
            }
        });
});

module.exports = controller;
