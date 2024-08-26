const { Router } = require("express");
const subscriptionService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;

const controller = Router();

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management
 */

/**
 * @swagger
 * /subscriptions/{userId}:
 *   get:
 *     summary: Get the subscription of a user by their ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user's subscription.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Subscription not found
 */
controller.get("/:userId", (req, res, next) => {
    subscriptionService.getSubscription(Number(req.params.userId))
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Create a new subscription for a user
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               end_date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *                 format: float
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Subscription created
 *       400:
 *         description: Bad request
 */
controller.post("/", (req, res, next) => {
    subscriptionService.createSubscription(req.body)
        .then((data) => res.status(201).json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /subscriptions/{userId}:
 *   patch:
 *     summary: Update a subscription for a user by their ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               end_date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *                 format: float
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subscription updated
 *       404:
 *         description: Subscription not found
 */
controller.patch("/:userId", (req, res, next) => {
    subscriptionService.updateSubscription(Number(req.params.userId), req.body)
        .then((data) => res.json(data))
        .catch((err) => next(err));
});

module.exports = controller;
