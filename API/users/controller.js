const { Router } = require("express");
const usersService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         first_name:
 *           type: string
 *           description: The first name of the user.
 *         last_name:
 *           type: string
 *           description: The last name of the user.
 *         telephone:
 *           type: string
 *           description: The telephone number of the user.
 *       example:
 *         id: 1
 *         email: user@example.com
 *         password: secret
 *         first_name: John
 *         last_name: Doe
 *         telephone: +1234567890
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
controller.get(
    "/",
    // authorize([/*"admin"*/]),
    (_req, res, next) => {
        usersService.getAll()
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
controller.get(
    "/:id",
    authorize([/*"admin"*/]),
    (req, res, next) => {
        usersService.getOne(Number(req.params.id), {
            id: req.auth?.uid,
            role: req.auth?.urole,
        })
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Utilisateur avec l'id ${req.params.id} non trouvé`);
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /users/verif/{id}:
 *   post:
 *     summary: Verify a specific column value for a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               param:
 *                 type: string
 *                 description: The name of the column to verify (e.g., 'Current_Subscription', 'Role').
 *                 example: role
 *               value:
 *                 type: string
 *                 description: The value to check for in the specified column.
 *                 example: admin
 *     responses:
 *       200:
 *         description: The user found with the specified column value.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing column name or value in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Column name and value must be provided."
 *       404:
 *         description: No user found with the specified column value.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found with role = admin for user ID 1"
 */

controller.post(
    "/verif/:id",
    (req, res, next) => {
        const { columnName: param, value } = req.body;
        const userId = Number(req.params.id);

        if (!param || !value) {
            return res.status(400).json({ error: "Column name and value must be provided." });
        }

        usersService.getOneVerifBy(param, value, userId)
            .then((data) => {
                if (data === null) {
                    return res.status(404).json({ error: `User ${userId} doesnt have ${param} = ${value}`});
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /users/verif-skill/{id}:
 *   post:
 *     summary: Verify if a specific user has a certain skill
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               skillName:
 *                 type: string
 *                 description: The name of the skill to verify.
 *                 example: Cuisine
 *     responses:
 *       200:
 *         description: The user has the specified skill.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 User_ID:
 *                   type: integer
 *                   description: The ID of the user.
 *                   example: 1
 *                 Skill_ID:
 *                   type: integer
 *                   description: The ID of the skill.
 *                   example: 2
 *                 Validation_Date:
 *                   type: string
 *                   format: date
 *                   description: The date when the skill was validated.
 *                   example: 2023-09-01
 *       400:
 *         description: Missing skill name or value in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Skill name and value must be provided."
 *       404:
 *         description: The user does not have the specified skill.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User 1 doesn't have skill: Cuisine"
 */
controller.post(
    "/verif-skill/:id",
    (req, res, next) => {
        const { skillName } = req.body;
        const userId = Number(req.params.id);

        if (!skillName) {
            return res.status(400).json({ error: "Skill name must be provided." });
        }
        usersService.verifySkill(skillName, userId)
            .then((data) => {
                if (data === null) {
                    return res.status(404).json({ error: `User ${userId} doesn't have skill: ${skillName}` });
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);



/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
controller.post(
    "/",
    (req, res, next) => {
        usersService.createOne(req.body)
            .then((data) => res.status(201).json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: User not found
 */
controller.delete(
    "/:id",
    authorize([/*"admin"*/]),
    (req, res, next) => {
        usersService.deleteOne(Number(req.params.id), {
            id: req.auth?.uid,
            role: req.auth?.urole,
        })
            .then((id) => {
                if (id === null) {
                    throw new NotFoundError(`Utilisateur avec l'id ${req.params.id} non trouvé`);
                }
                res.status(204).json();
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
controller.patch(
    "/:id",
    authorize([/*"admin"*/]),
    (req, res, next) => {
        usersService.updateOne(Number(req.params.id), req.body, {
            id: req.auth?.uid,
            role: req.auth?.urole,
        })
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Utilisateur avec l'id ${req.params.id} non trouvé`);
                }
                res.status(200).json(data);
            })
            .catch((err) => next(err));
    },
);

module.exports = controller;
