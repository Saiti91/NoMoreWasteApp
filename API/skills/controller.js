const {Router} = require("express");
const skillsService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const {upload, checkFileProvided} = require('../common/middlewares/uploads_middleware');

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the skill.
 *         name:
 *           type: string
 *           description: The name of the skill.
 *       example:
 *         id: 1
 *         name: Cuisine
 */

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill management
 */

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Retrieve a list of skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: A list of skills.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 */
controller.get(
    "/",
    (_req, res, next) => {
        skillsService.getAll()
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /skills/unvalidated:
 *   get:
 *     summary: Get all unvalidated skills along with user information.
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: A list of unvalidated skills along with associated user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     description: The ID of the user associated with the skill.
 *                   userName:
 *                     type: string
 *                     description: The name of the user.
 *                   userEmail:
 *                     type: string
 *                     description: The email of the user.
 *                   skillId:
 *                     type: integer
 *                     description: The ID of the skill.
 *                   skillName:
 *                     type: string
 *                     description: The name of the skill.
 *                   documentPath:
 *                     type: string
 *                     description: The path to the uploaded document (if any).
 *       404:
 *         description: No unvalidated skills found.
 */
controller.get("/unvalidated", (req, res, next) => {
    console.log('Fetching all unvalidated skills');
    skillsService.getAllUnvalidatedSkills()
        .then((data) => {
            if (data.length === 0) {
                throw new NotFoundError("No unvalidated skills found");
            }
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @swagger
 * /skills/unvalidated/{userId}:
 *   get:
 *     summary: Get all unvalidated skills for a specific user by user ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of unvalidated skills for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Skill_ID:
 *                     type: integer
 *                     description: The ID of the skill
 *                   Name:
 *                     type: string
 *                     description: The name of the skill
 *                   Document_Path:
 *                     type: string
 *                     description: The path to the uploaded document
 *                   Validation_Date:
 *                     type: string
 *                     format: date-time
 *                     description: The validation date (null if not validated)
 *       404:
 *         description: No unvalidated skills found for the user
 */
controller.get("/unvalidated/:userId", (req, res, next) => {
    console.log('controller /unvalidated/:userId req.params.userId:', req.params.userId);
    skillsService.getUnvalidatedSkillsForUser(Number(req.params.userId))
        .then((data) => {
            if (data.length === 0) {
                throw new NotFoundError(`No unvalidated skills found for user with id ${req.params.userId}`);
            }
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * @swagger
 * /skills/user/{userId}/skill/{skillId}/validate:
 *   patch:
 *     summary: Validate a specific skill for a user
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: skillId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The skill ID
 *     responses:
 *       200:
 *         description: Skill validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 userId:
 *                   type: integer
 *                   description: The user ID
 *                 skillId:
 *                   type: integer
 *                   description: The skill ID
 *                 validationDate:
 *                   type: string
 *                   format: date
 *                   description: The date of validation
 *       404:
 *         description: No skill found for user with the given IDs
 */
controller.patch('/user/:userId/skill/:skillId/validate', (req, res, next) => {
    const userId = Number(req.params.userId);
    const skillId = Number(req.params.skillId);

    skillsService.validateUserSkill(userId, skillId)
        .then(data => res.json(data))
        .catch(err => next(err));
});

/**
 * @swagger
 * /skills/user/{userId}:
 *   get:
 *     summary: Get all skills for a specific user by user ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of skills for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       404:
 *         description: No skills found for the user
 */
controller.get("/user/:userId", (req, res, next) => {
    skillsService.getAllForUser(Number(req.params.userId))
        .then((data) => res.json(data))
        .catch((err) => {
            next(err);
        });
});

/**
 * @swagger
 * /skills/{id}:
 *   get:
 *     summary: Get a skill by ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The skill ID
 *     responses:
 *       200:
 *         description: A single skill.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Skill not found
 */
controller.get(
    "/:id",
    (req, res, next) => {
        console.log('controller /:id req.params.id:', req.params.id);
        skillsService.getOne(Number(req.params.id))
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Compétence avec l'id ${req.params.id} non trouvée`);
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /skills/user/{userId}/{skillId}:
 *   delete:
 *     summary: Delete a specific skill for a user
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: skillId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The skill ID
 *     responses:
 *       204:
 *         description: Skill successfully deleted.
 *       404:
 *         description: Skill not found for the user.
 *       400:
 *         description: Bad request, invalid user ID or skill ID.
 */
controller.delete("/user/:userId/:skillId", (req, res, next) => {
    const userId = Number(req.params.userId);
    const skillId = Number(req.params.skillId);

    if (isNaN(userId) || isNaN(skillId)) {
        return res.status(400).json({error: "Invalid user ID or skill ID"});
    }

    skillsService.deleteSkillForUser(userId, skillId)
        .then((deleted) => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({error: "Skill not found for the user"});
            }
        })
        .catch((err) => next(err));
});

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       201:
 *         description: The created skill.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 */
controller.post("/", (req, res, next) => {
    skillsService.createOne(req.body)
        .then((data) => res.status(201).json(data))
        .catch((err) => next(err));
});

/**
 * @swagger
 * /skills/{id}:
 *   delete:
 *     summary: Delete a skill by ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The skill ID
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Skill not found
 */
controller.delete(
    "/:id",
    (req, res, next) => {
        skillsService.deleteOne(Number(req.params.id))
            .then((id) => {
                if (id === null) {
                    throw new NotFoundError(`Compétence avec l'id ${req.params.id} non trouvée`);
                }
                res.status(204).json();
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /skills/{id}:
 *   patch:
 *     summary: Update a skill by ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The skill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the skill
 *     responses:
 *       200:
 *         description: The updated skill.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Skill not found
 */
controller.patch(
    "/:id",
    (req, res, next) => {
        skillsService.updateOne(Number(req.params.id), req.body)
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Compétence avec l'id ${req.params.id} non trouvée`);
                }
                res.status(200).json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /skills/{userId}/skills:
 *   post:
 *     summary: Add a new skill to a user
 *     tags: [Skills]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               skill_id:
 *                 type: integer
 *                 description: The skill ID to add
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: The optional document to upload
 *     responses:
 *       201:
 *         description: Skill added to the user
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
controller.post('/:userId/skills', upload.single('document'), checkFileProvided, async (req, res, next) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        const {skill_id} = req.body;
        const userId = req.params.userId;
        const documentPath = req.file.filename;

        console.log('documentPath:', documentPath);

        const result = await skillsService.addSkillForUser(userId, skill_id, documentPath);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});


module.exports = controller;
