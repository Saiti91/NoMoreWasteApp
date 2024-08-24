const { Router } = require("express");
const requestsService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");


const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         Request_ID:
 *           type: integer
 *           description: The request ID
 *         Product_ID:
 *           type: integer
 *           description: The product ID
 *         Quantity:
 *           type: integer
 *           description: The quantity requested
 *         Date:
 *           type: string
 *           format: date
 *           description: The date of the request
 *         User_ID:
 *           type: integer
 *           description: The ID of the user making the request
 *       required:
 *         - Product_ID
 *         - Quantity
 *         - Date
 *         - User_ID
 */

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: API for managing requests
 */

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Retrieve a list of requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 */
controller.get("/", (req, res, next) => {
    requestsService.getAll()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @swagger
 * /requests/notcollected:
 *   get:
 *     summary: Retrieve all requests where Route_ID is NULL
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: A list of requests where Route_ID is NULL
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 */
controller.get("/notcollected", (req, res, next) => {
    requestsService.getAllWithoutRoute()
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /requests/user/{userID}:
 *   get:
 *     summary: Retrieve requests by user ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
controller.get("/user/:userID", (req, res, next) => {
    requestsService.getOneUserID(Number(req.params.userID))
        .then((data) => {
            if (!data || data.length === 0) {
                throw new NotFoundError(`Request with userID ${req.params.userID} not found`);
            }
            res.json(data);
            console.log('Retour du controlleur : ', data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /requests/product/{productID}:
 *   get:
 *     summary: Retrieve requests by product ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: productID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
controller.get("/product/:productID", (req, res, next) => {
    requestsService.getOneProduct(Number(req.params.productID))
        .then((data) => {
            if (!data || data.length === 0) {
                throw new NotFoundError(`Request with productID ${req.params.productID} not found`);
            }
            res.json(data);
            console.log('Retour du controlleur : ', data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /requests/date:
 *   get:
 *     summary: Retrieve requests by date
 *     tags: [Requests]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date of the requests
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
controller.get("/date/", (req, res, next) => {
    requestsService.getOneByDate(req.body.date)
        .then((data) => {
            if (!data || data.length === 0) {
                throw new NotFoundError(`Request with specified date not found`);
            }
            res.json(data);
            console.log('Retour du controlleur : ', data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Retrieve a request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the request
 *     responses:
 *       200:
 *         description: A request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
controller.get("/:id", (req, res, next) => {
    requestsService.getOneRequest(Number(req.params.id))
        .then((data) => {
            if (!data) {
                throw new NotFoundError(`Request with ID ${req.params.id} not found`);
            }
            res.json(data);
            console.log('Retour du controlleur : ', data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: Request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 */
controller.post("/", (req, res, next) => {
    requestsService.createOne(req.body)
        .then((data) => res.status(201).json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete a request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the request
 *     responses:
 *       204:
 *         description: Request deleted
 *       404:
 *         description: Request not found
 *     security:
 *       - bearerAuth: []
 */
controller.delete("/:id", authorize(["admin"]), (req, res, next) => {
    requestsService.deleteOne(Number(req.params.id), req.user)
        .then((deleted) => {
            if (!deleted) {
                throw new NotFoundError(`Request with ID ${req.params.id} not found`);
            }
            res.status(204).json();
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /requests/{id}:
 *   patch:
 *     summary: Update a request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: Request updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
controller.patch("/:id", (req, res, next) => {
    const requestId = Number(req.params.id);
    const data = req.body;

    requestsService.updateOne(requestId, data)
        .then((updatedRequest) => {
            res.status(200).json(updatedRequest);
        })
        .catch((err) => next(err));
});

module.exports = controller;
