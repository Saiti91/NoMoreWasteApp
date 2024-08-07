const {Router} = require("express");
const donationsService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Stock:
 *       type: object
 *       required:
 *         - Product_ID
 *         - Quantity
 *       properties:
 *         Product_ID:
 *           type: integer
 *           description: The ID of the product.
 *         Quantity:
 *           type: integer
 *           description: The quantity of the product in stock.
 *         Storage_Date:
 *           type: string
 *           format: date
 *           description: The date when the product was stored.
 *       example:
 *         Product_ID: 1
 *         Quantity: 100
 *         Storage_Date: 2024-08-06
 */

/**
 * @swagger
 * tags:
 *   name: Stocks
 *   description: Stock management
 */

/**
 * @swagger
 * /stocks:
 *   get:
 *     summary: Retrieve a list of stocks
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: A list of stocks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stock'
 */
controller.get(
    "/",
    (req, res, next) => {
        donationsService.getAll()
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /stocks/{id}:
 *   get:
 *     summary: Get a stock by ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock ID
 *     responses:
 *       200:
 *         description: A single stock.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       404:
 *         description: Stock not found
 */
controller.get(
    "/:donorID",
    (req, res, next) => {
        donationsService.getOne(Number(req.params.donorID))
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Stock with Product_ID ${req.params.donorID} not found`);
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /stocks:
 *   post:
 *     summary: Create a new stock
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stock'
 *     responses:
 *       201:
 *         description: The created stock.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 */
controller.post(
    "/",
    (req, res, next) => {
        donationsService.createOne(req.body)
            .then((data) => res.status(201).json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /stocks/{id}:
 *   delete:
 *     summary: Delete a stock by ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock ID
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Stock not found
 */
controller.delete(
    "/:id",
    authorize(["admin"]),
    (req, res, next) => {
        donationsService.deleteOne(Number(req.params.id), req.user)
            .then((deleted) => {
                if (!deleted) {
                    throw new NotFoundError(`Stock with Product_ID ${req.params.id} not found`);
                }
                res.status(204).json();
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /stocks/{id}:
 *   patch:
 *     summary: Update a stock by ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stock'
 *     responses:
 *       200:
 *         description: The updated stock.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       404:
 *         description: Stock not found
 */
controller.patch("/:id", (req, res, next) => {
    const donationId = Number(req.params.id);
    const data = req.body;

    donationsService.updateOne(donationId, data)
        .then((updatedDonation) => {
            res.status(200).json(updatedDonation);
        })
        .catch((err) => next(err));
});

module.exports = controller;
