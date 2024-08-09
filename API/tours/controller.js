const { Router } = require("express");
const toursService = require("./service");
const NotFoundError = require("../common/http_errors").NotFoundError;
const authorize = require("../common/middlewares/authorize_middleware");

const controller = Router();

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Gestion des tournées
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - Date
 *         - User_ID
 *         - Truck_ID
 *         - Type
 *         - Destinations
 *       properties:
 *         Date:
 *           type: string
 *           format: date
 *           example: "2024-08-09"
 *         User_ID:
 *           type: integer
 *           example: 1
 *         Truck_ID:
 *           type: integer
 *           example: 5
 *         Type:
 *           type: boolean
 *           example: true
 *         Destinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Destination'
 *
 *     UpdateTour:
 *       type: object
 *       properties:
 *         Date:
 *           type: string
 *           format: date
 *           example: "2024-08-09"
 *         User_ID:
 *           type: integer
 *           example: 1
 *         Truck_ID:
 *           type: integer
 *           example: 5
 *         Type:
 *           type: boolean
 *           example: true
 *         Destinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Destination'
 *
 *     Destination:
 *       type: object
 *       required:
 *         - Address_ID
 *         - Products
 *       properties:
 *         Address_ID:
 *           type: integer
 *           example: 123
 *         Products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *
 *     Product:
 *       type: object
 *       required:
 *         - Product_ID
 *         - Quantity
 *       properties:
 *         Product_ID:
 *           type: integer
 *           example: 45
 *         Quantity:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Récupère toutes les tournées
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Liste de toutes les tournées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tour'
 *       500:
 *         description: Erreur interne du serveur
 */
controller.get("/", (req, res, next) => {
    toursService.getAll()
        .then(data => res.json(data))
        .catch(err => next(err));
});

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Récupère une tournée spécifique par ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tournée
 *     responses:
 *       200:
 *         description: Détails de la tournée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
controller.get("/:id", (req, res, next) => {
    toursService.getOne(Number(req.params.id))
        .then(data => {
            if (!data) {
                throw new NotFoundError(`Tour with ID ${req.params.id} not found`);
            }
            res.json(data);
        })
        .catch(err => next(err));
});

/**
 * @swagger
 * /tours:
 *   post:
 *     summary: Crée une nouvelle tournée
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       201:
 *         description: Tournée créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
controller.post("/", (req, res, next) => {
    toursService.createOne(req.body)
        .then(data => res.status(201).json(data))
        .catch(err => next(err));
});

/**
 * @swagger
 * /tours/{id}:
 *   put:
 *     summary: Met à jour une tournée existante
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tournée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTour'
 *     responses:
 *       200:
 *         description: Tournée mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
controller.put("/:id", (req, res, next) => {
    toursService.updateOne(Number(req.params.id), req.body)
        .then(updated => res.status(200).json(updated))
        .catch(err => next(err));
});

/**
 * @swagger
 * /tours/{id}:
 *   delete:
 *     summary: Supprime une tournée existante
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tournée
 *     responses:
 *       204:
 *         description: Tournée supprimée avec succès
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
controller.delete("/:id", authorize(["admin"]), (req, res, next) => {
    toursService.deleteOne(Number(req.params.id))
        .then(deleted => {
            if (!deleted) {
                throw new NotFoundError(`Tour with ID ${req.params.id} not found`);
            }
            res.status(204).end();
        })
        .catch(err => next(err));
});

/**
 * @swagger
 * /tours/{id}/destinations:
 *   post:
 *     summary: Ajoute une nouvelle destination à une tournée
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tournée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destination'
 *     responses:
 *       201:
 *         description: Destination ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destination'
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
controller.post("/:id/destinations", (req, res, next) => {
    toursService.addDestination(Number(req.params.id), req.body)
        .then(data => res.status(201).json(data))
        .catch(err => next(err));
});

/**
 * @swagger
 * /tours/{id}/destinations/{destinationId}:
 *   delete:
 *     summary: Supprime une destination d'une tournée
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tournée
 *       - in: path
 *         name: destinationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la destination
 *     responses:
 *       204:
 *         description: Destination supprimée avec succès
 *       404:
 *         description: Tournée ou destination non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
controller.delete("/:id/destinations/:destinationId", (req, res, next) => {
    toursService.removeDestination(Number(req.params.id), Number(req.params.destinationId))
        .then(() => res.status(204).end())
        .catch(err => next(err));
});

/**
 * @swagger
 * /destinations/{id}/products:
 *   post:
 *     summary: Ajoute un produit à une destination
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la destination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
controller.post("/destinations/:id/products", (req, res, next) => {
    toursService.addProductToDestination(Number(req.params.id), req.body)
        .then(data => res.status(201).json(data))
        .catch(err => next(err));
});

/**
 * @swagger
 * /destinations/{id}/products/{productId}:
 *   delete:
 *     summary: Supprime un produit d'une destination
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la destination
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du produit
 *     responses:
 *       204:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Destination ou produit non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
controller.delete("/destinations/:id/products/:productId", (req, res, next) => {
    toursService.removeProductFromDestination(Number(req.params.id), Number(req.params.productId))
        .then(() => res.status(204).end())
        .catch(err => next(err));
});

module.exports = controller;
