const { Router } = require('express');
const ticketsService = require('./service');
const NotFoundError = require('../common/http_errors').NotFoundError;
const {upload, checkFileProvided} = require('../common/middlewares/uploads_middleware');
const controller = Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Gestion des tickets
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - title
 *         - propose
 *         - category
 *         - startDate
 *         - startTime
 *         - duration
 *         - format
 *       properties:
 *         ticket_id:
 *           type: integer
 *           description: The auto-generated ID of the ticket.
 *         title:
 *           type: string
 *           description: The title of the ticket.
 *         propose:
 *           type: string
 *           enum: [Proposer, Demander]
 *           description: Whether the service is being proposed or requested.
 *         category:
 *           type: string
 *           description: The category of the ticket.
 *         startDate:
 *           type: string
 *           format: date
 *           description: The start date of the service.
 *         startTime:
 *           type: string
 *           format: time
 *           description: The start time of the service.
 *         duration:
 *           type: string
 *           description: The duration of the service.
 *         format:
 *           type: string
 *           enum: [Minutes, Heures, Jours]
 *           description: The format of the duration.
 *         places:
 *           type: string
 *           description: Number of places available (if applicable).
 *         tools:
 *           type: string
 *           enum: [Aucun, Autre]
 *           description: Tools required for the service.
 *         toolsOther:
 *           type: string
 *           description: Specify the tool if 'Autre' is selected.
 *         extraTools:
 *           type: array
 *           items:
 *             type: string
 *           description: Extra tools required for the service.
 *         addresses:
 *           type: string
 *           description: Address of the service.
 *         needsCustomerAddress:
 *           type: boolean
 *           description: Indicates if customer addresses is needed.
 *         description:
 *           type: string
 *           description: Description of the service.
 *         image:
 *           type: string
 *           format: binary
 *           description: Image associated with the ticket.
 *       example:
 *         ticket_id: 1
 *         title: "Atelier de peinture"
 *         propose: "Proposer"
 *         category: "Arts"
 *         startDate: "2024-09-01"
 *         startTime: "10:00"
 *         duration: "2"
 *         format: "Heures"
 *         places: "10"
 *         tools: "Aucun"
 *         toolsOther: ""
 *         extraTools: []
 *         addresses: "123 Rue de la Peinture, Paris"
 *         needsCustomerAddress: false
 *         description: "Atelier de peinture pour débutants."
 *         image: null
 */

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad Request - Validation errors or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "\"title\" is required"
 *       500:
 *         description: Internal Server Error - Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
controller.post("/", upload.single('image'),async (req, res, next) => {
    try {
        console.log("controller :",req.body);
        const newTicket = await ticketsService.createOne(req.body);
        res.status(201).json(newTicket);
    } catch (err) {
        next(err);
    }
});


/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: The requested ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 */
controller.get("/:id", async (req, res, next) => {
    try {
        const ticket = await ticketsService.getOne(Number(req.params.id));
        res.json(ticket);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: A list of all tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
controller.get("/", async (req, res, next) => {
    try {
        const tickets = await ticketsService.getAll();
        res.json(tickets);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update an existing ticket
 *     tags: [Tickets]
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
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: The updated ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 */
controller.put("/:id", async (req, res, next) => {
    try {
        const updatedTicket = await ticketsService.updateOne(Number(req.params.id), req.body);
        res.json(updatedTicket);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: Confirmation of ticket deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Ticket not found
 */
controller.delete("/:id", async (req, res, next) => {
    try {
        const result = await ticketsService.deleteOne(Number(req.params.id));
        res.json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /tickets/user/{id}:
 *   get:
 *     summary: Get all tickets for a specific user (owner)
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID (owner_id)
 *     responses:
 *       200:
 *         description: A list of tickets owned by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: No tickets found for this user.
 */
controller.get("/user/:id", async (req, res, next) => {
    try {
        const tickets = await ticketsService.getAllForUser(Number(req.params.id));
        if (tickets.length === 0) {
            return res.status(404).json({ error: `No tickets found for user ID ${req.params.id}` });
        }
        res.json(tickets);
    } catch (err) {
        next(err);
    }
});



module.exports = controller;
