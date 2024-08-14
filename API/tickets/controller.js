const { Router } = require("express");
const ticketsService = require("./service");
const NotFoundError = require("../common/http_errors");
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - title
 *         - direction
 *         - category_id
 *         - start_date
 *         - duration
 *         - places
 *         - address_id
 *         - address_needs
 *         - status_id
 *         - owner_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the ticket.
 *         title:
 *           type: string
 *           description: The title of the ticket.
 *         direction:
 *           type: boolean
 *           description: The direction of the ticket.
 *         category_id:
 *           type: integer
 *           description: The category ID associated with the ticket.
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: The start date of the ticket.
 *         duration:
 *           type: integer
 *           description: The duration of the event.
 *         places:
 *           type: integer
 *           description: Number of places available.
 *         tools:
 *           type: string
 *           description: Tools required for the event.
 *         address_id:
 *           type: integer
 *           description: The ID of the address.
 *         address_needs:
 *           type: boolean
 *           description: Whether address needs are required.
 *         customers_address:
 *           type: string
 *           description: The customer's address.
 *         description:
 *           type: string
 *           description: A description of the ticket.
 *         image:
 *           type: string
 *           description: An image URL for the ticket.
 *         status_id:
 *           type: integer
 *           description: The status ID of the ticket.
 *         owner_id:
 *           type: integer
 *           description: The ID of the ticket's owner.
 */

/**
 * @swagger
 * tags:
 *   name: tickets
 *   description: Ticket management
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Retrieve a list of tickets
 *     tags: [tickets]
 *     responses:
 *       200:
 *         description: A list of tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
controller.get(
    "/",
    (req, res, next) => {
        ticketsService.getAll()
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: A single ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found.
 */
controller.get(
    "/:id",
    (req, res, next) => {
        ticketsService.getOne(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: The created ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 */
controller.post(
    "/",
    authorize(),  // Middleware to check authorization
    (req, res, next) => {
        ticketsService.createOne(req.body)
            .then((id) => res.status(201).json({ id }))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update a ticket by ID
 *     tags: [tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       204:
 *         description: No Content.
 *       404:
 *         description: Ticket not found.
 */
controller.put(
    "/:id",
    authorize(),  // Middleware to check authorization
    (req, res, next) => {
        ticketsService.updateOne(req.params.id, req.body)
            .then(() => res.status(204).end())
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       204:
 *         description: No Content.
 *       404:
 *         description: Ticket not found.
 */
controller.delete(
    "/:id",
    authorize(),  // Middleware to check authorization
    (req, res, next) => {
        ticketsService.deleteOne(req.params.id)
            .then(() => res.status(204).end())
            .catch((err) => next(err));
    },
);

module.exports = controller;
