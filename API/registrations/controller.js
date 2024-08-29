const { Router } = require("express");
const registrationsService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - Ticket_ID
 *         - User_ID
 *       properties:
 *         Ticket_ID:
 *           type: integer
 *           description: The ID of the ticket.
 *         User_ID:
 *           type: integer
 *           description: The ID of the user.
 *       example:
 *         Ticket_ID: 1
 *         User_ID: 2
 */

/**
 * @swagger
 * tags:
 *   name: Registrations
 *   description: User ticket registrations management
 */

/**
 * @swagger
 * /registrations:
 *   get:
 *     summary: Retrieve a list of all registrations
 *     tags: [Registrations]
 *     responses:
 *       200:
 *         description: A list of all registrations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 */
controller.get("/", (_req, res, next) => {
    registrationsService.getAll()
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /registrations/{ticketId}/{userId}:
 *   post:
 *     summary: Register a user to a ticket
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the ticket
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       201:
 *         description: User successfully registered to the ticket.
 *       400:
 *         description: Invalid request parameters.
 *       404:
 *         description: User or ticket not found.
 */
controller.post("/:ticketId/:userId", (req, res, next) => {
    registrationsService.createOne(Number(req.params.ticketId), Number(req.params.userId))
        .then(() => res.status(201).json({ message: "User successfully registered to the ticket." }))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /registrations/{ticketId}/{userId}:
 *   delete:
 *     summary: Unregister a user from a ticket
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the ticket
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       204:
 *         description: User successfully unregistered from the ticket.
 *       400:
 *         description: Invalid request parameters.
 *       404:
 *         description: Registration not found.
 */
controller.delete("/:ticketId/:userId", (req, res, next) => {
    registrationsService.deleteOne(Number(req.params.ticketId), Number(req.params.userId))
        .then(() => res.status(204).json())
        .catch((err) => next(err));
});

/**
 * @swagger
 * /registrations/ticket/{ticketId}:
 *   get:
 *     summary: Retrieve all registrations for a specific ticket
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the ticket
 *     responses:
 *       200:
 *         description: A list of registrations for the ticket.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 *       404:
 *         description: No registrations found for the ticket.
 */
controller.get("/ticket/:ticketId", (req, res, next) => {
    registrationsService.getAllForTicket(Number(req.params.ticketId))
        .then((data) => {
            if (data.length === 0) {
                throw new NotFoundError(`No registrations found for ticket ID ${req.params.ticketId}`);
            }
            res.json(data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /registrations/user/{userId}:
 *   get:
 *     summary: Retrieve all registrations for a specific user
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of registrations for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 *       404:
 *         description: No registrations found for the user.
 */
controller.get("/user/:userId", (req, res, next) => {
    registrationsService.getAllForUser(Number(req.params.userId))
        .then((data) => {
            if (data.length === 0) {
                throw new NotFoundError(`No registrations found for user ID ${req.params.userId}`);
            }
            res.json(data);
        })
        .catch((err) => next(err));
});

module.exports = controller;
