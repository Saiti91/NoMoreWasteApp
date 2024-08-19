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
 *         Donation_ID:
 *           type: integer
 *           description: The auto-generated ID of the donation
 *         Product_ID:
 *           type: integer
 *           description: The product ID related to the donation
 *         Quantity:
 *           type: integer
 *           description: The quantity of the product donated
 *         Donor_User_ID:
 *           type: integer
 *           description: The ID of the user who donated the product
 *         Date:
 *           type: string
 *           format: date
 *           description: The date the donation was made
 *         Route_ID:
 *           type: integer
 *           description: The ID of the route associated with the donation (nullable)
 *         Collected:
 *           type: boolean
 *           description: Whether the donation has been collected
 *         Collection_Date:
 *           type: string
 *           format: date
 *           description: The date the donation was collected (nullable)
 *       required:
 *         - Product_ID
 *         - Quantity
 *         - Date
 *       example:
 *         Donation_ID: 1
 *         Product_ID: 101
 *         Quantity: 50
 *         Donor_User_ID: 10
 *         Date: "2024-08-19"
 *         Route_ID: null
 *         Collected: false
 *         Collection_Date: null
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
 *     summary: Retrieve a list of all donations
 *     tags: [Donation]
 *     responses:
 *       200:
 *         description: A list of all donations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 */
controller.get("/", (req, res, next) => {
    donationsService.getAll()
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /donations/donor/{donorID}:
 *   get:
 *     summary: Retrieve donations by Donor ID
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
 *         description: A list of donations by the donor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donations not found
 */
controller.get("/donor/:donorID", (req, res, next) => {
    donationsService.getOneDonor(Number(req.params.donorID))
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`No donations found for donor ID ${req.params.donorID}`);
            }
            res.json(data);
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /donations/product/{productID}:
 *   get:
 *     summary: Retrieve donations by Product ID
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
 *         description: A list of donations by the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donations not found
 */
controller.get("/product/:productID", (req, res, next) => {
    donationsService.getOneProduct(Number(req.params.productID))
        .then((data) => {
            if (data === null) {
                throw new NotFoundError(`No donations found for product ID ${req.params.productID}`);
            }
            res.json(data);
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
 *         description: A single donation
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
 *         description: Donation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Invalid input data
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
 *         description: Donation deleted successfully
 *       404:
 *         description: Donation not found
 *       401:
 *         description: Unauthorized access
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
 *         description: Donation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found
 *       400:
 *         description: Invalid input data
 */
controller.patch("/:id", (req, res, next) => {
    const donationId = Number(req.params.id);
    const data = req.body;

    donationsService.updateOne(donationId, data)
        .then((updatedDonation) => {
            if (!updatedDonation) {
                throw new NotFoundError(`Donation with ID ${req.params.id} not found`);
            }
            res.status(200).json(updatedDonation);
        })
        .catch((err) => next(err));
});

module.exports = controller;
