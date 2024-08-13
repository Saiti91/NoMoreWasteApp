const { Router } = require("express");
const authService = require("./service");

const controller = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email.
 *         password:
 *           type: string
 *           description: The user's password.
 *       example:
 *         email: user@example.com
 *         password: secret
 *     Register:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email.
 *         password:
 *           type: string
 *           description: The user's password.
 *         firstname:
 *           type: string
 *           description: The user's first name.
 *         name:
 *           type: string
 *           description: The user's last name.
 *       example:
 *         email: user@example.com
 *         password: secret
 *         firstname: John
 *         name: Doe
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Authorization:
 *             description: Bearer token
 *             schema:
 *               type: string
 *               example: Bearer <token>
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
controller.post("/login", (req, res, next) => {
    authService
        .login(req.body)
        .then((token) => {
            res.set('Authorization', `Bearer ${token}`);
            res.status(200).send({
                message: 'Login successful'
            });
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already taken
 */
controller.post("/register", (req, res, next) => {
    authService
        .register(req.body)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = controller;
