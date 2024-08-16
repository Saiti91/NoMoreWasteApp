const { Router } = require("express");
const donationsService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Donation:
 *       type: object
 *       properties:
 *         Product_ID:
 *           type: integer
 *           description: The product ID
 *         Quantity:
 *           type: integer
 *           description: The quantity of the product
 *         Donor_User:
 *           type: string
 *           description: The ID or name of the donor user
 *         Recipient_User:
 *           type: string
 *           description: The ID or name of the recipient user
 *       required:
 *         - Product_ID
 *         - Quantity
 *         - Donor_User
 */

/**
 * @swagger
 * tags:
 *   name: Donation
 *   description: Donation management
 */

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Retrieve a list of donations
 *     tags: [Donation]
 *     responses:
 *       200:
 *         description: A list of donations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 */
controller.get("/", (req, res, next) => {
    donationsService.getAll()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @swagger
 * /donations/donor/{donorID}:
 *   get:
 *     summary: Retrieve the donations by Donor ID
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: donorID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the donor
 *     responses:
 *       200:
 *         description: A list of donations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found
 */
controller.get("/donor/:donorID", (req, res, next) => {
    donationsService.getOneDonor(Number(req.params.donorID))
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Donation with donorID ${req.params.donorID} not found`);
            }
            res.json(data);
            console.log('Retour du controlleur : ', data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /donations/product/{productID}:
 *   get:
 *     summary: Retrieve the donations by Product ID
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: productID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: A list of donations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found
 */
controller.get("/product/:productID", (req, res, next) => {
    donationsService.getOneProduct(Number(req.params.productID))
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Donation with productID ${req.params.productID} not found`);
            }
            res.json(data);
            console.log('Retour du controlleur : ', data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /donations/{id}:
 *   get:
 *     summary: Retrieve a donation by ID
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the donation
 *     responses:
 *       200:
 *         description: A donation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found
 */
controller.get("/:id", (req, res, next) => {
    donationsService.getOneDonation(Number(req.params.id))
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`Donation with ID ${req.params.id} not found`);
            }
            res.json(data);
            console.log('Retour du controlleur : ', data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Create a new donation
 *     tags: [Donation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Donation'
 *     responses:
 *       201:
 *         description: Donation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 */
controller.post("/", (req, res, next) => {
    donationsService.createOne(req.body)
        .then((data) => res.status(201).json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /donations/{id}:
 *   delete:
 *     summary: Delete a donation by ID
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the donation
 *     responses:
 *       204:
 *         description: Donation deleted
 *       404:
 *         description: Donation not found
 *     security:
 *       - bearerAuth: []
 */
controller.delete("/:id", authorize(["admin"]), (req, res, next) => {
    donationsService.deleteOne(Number(req.params.id), req.user)
        .then((deleted) => {
            if (!deleted) {
                throw new NotFoundError(`Donation with ID ${req.params.id} not found`);
            }
            res.status(204).json();
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /donations/{id}:
 *   patch:
 *     summary: Update a donation by ID
 *     tags: [Donation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the donation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Donation'
 *     responses:
 *       200:
 *         description: Donation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found
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
