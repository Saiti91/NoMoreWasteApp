const {Router} = require("express");
const recipeService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - name
 *         - instructions
 *         - ingredients
 *       properties:
 *         Recipes_ID:
 *           type: integer
 *           description: The auto-generated ID of the recipe
 *         name:
 *           type: string
 *           description: The name of the recipe
 *         instructions:
 *           type: string
 *           description: The instructions to prepare the recipe
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: ID of the product used as an ingredient
 *               quantity:
 *                 type: number
 *                 description: Quantity of the ingredient
 *               unit:
 *                 type: string
 *                 description: Unit of measurement for the ingredient
 *               description:
 *                 type: string
 *                 description: Additional details about the ingredient
 *       example:
 *         Recipes_ID: 1
 *         name: "Salade de poulet aux légumes"
 *         instructions: "Grillez le poulet, coupez la tomate et le poivron en dés..."
 *         ingredients:
 *           - product_id: 1
 *             quantity: 1
 *             unit: "pièce"
 *             description: "Poulet grillé"
 */

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of all recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
controller.get(
    "/",
    (req, res, next) => {
        recipeService.getAllRecipes()
            .then((data) => res.json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: The recipe details by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
controller.get(
    "/:id",
    (req, res, next) => {
        recipeService.getRecipeById(Number(req.params.id))
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Recipe with ID ${req.params.id} not found`);
                }
                res.json(data);
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recipe created successfully and returns the Recipe ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Recipes_ID:
 *                   type: integer
 *                   description: The ID of the newly created recipe
 *                   example: 123
 *       400:
 *         description: Invalid input
 */
controller.post(
    "/",
    (req, res, next) => {
        recipeService.createRecipe(req.body)
            .then((data) => res.status(201).json({message: 'Recipe created successfully', recipeId: data}))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /recipes/filter:
 *   post:
 *     summary: Filter recipes based on available products
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of product IDs available in the stock
 *             example:
 *               products: [1, 4, 7, 39, 40]
 *     responses:
 *       200:
 *         description: List of recipes that can be made with the provided products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input, expected an array of product IDs
 *       500:
 *         description: Internal server error
 */
controller.post(
    "/filter",
    (req, res, next) => {
        recipeService.filterRecipesByProducts(req.body.products)
            .then((data) => res.status(200).json(data))
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /recipes/{id}:
 *   patch:
 *     summary: Update a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *       400:
 *         description: Invalid input
 */
controller.patch(
    "/:id",
    (req, res, next) => {
        recipeService.updateRecipe(Number(req.params.id), req.body)
            .then((data) => {
                if (data === null) {
                    throw new NotFoundError(`Recipe with ID ${req.params.id} not found`);
                }
                res.status(200).json({message: 'Recipe updated successfully'});
            })
            .catch((err) => next(err));
    },
);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The recipe ID
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 *       401:
 *         description: Unauthorized
 */
controller.delete(
    "/:id",
    authorize(["admin"]),
    (req, res, next) => {
        recipeService.deleteRecipe(Number(req.params.id))
            .then((deleted) => {
                if (!deleted) {
                    throw new NotFoundError(`Recipe with ID ${req.params.id} not found`);
                }
                res.status(204).json();
            })
            .catch((err) => next(err));
    },
);

module.exports = controller;
