const { Router } = require('express');
const AddressService = require('./service');
const { InvalidArgumentError, NotFoundError } = require('../common/service_errors');
const controller = Router();

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Gestion des adresses
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - postalCode
 *         - country
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the address.
 *         street:
 *           type: string
 *           description: The street of the address.
 *         city:
 *           type: string
 *           description: The city of the address.
 *         postalCode:
 *           type: string
 *           description: The postal code of the address.
 *         country:
 *           type: string
 *           description: The country of the address.
 *       example:
 *         id: 1
 *         street: "123 Rue de la Peinture"
 *         city: "Paris"
 *         postalCode: "75001"
 *         country: "France"
 */

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Créer une nouvelle adresse
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Adresse créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Mauvaise demande - Erreurs de validation ou champs requis manquants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "\"street\" is required"
 *       500:
 *         description: Erreur serveur interne - Erreur inattendue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 *                 error:
 *                   type: string
 *                   example: "Message d'erreur détaillé"
 */
controller.post("/", async (req, res, next) => {
    try {
        const address = await AddressService.createOne(req.body);
        res.status(201).json(address);
    } catch (error) {
        if (error instanceof InvalidArgumentError) {
            res.status(400).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Récupérer une adresse par ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de l'adresse
 *     responses:
 *       200:
 *         description: Adresse demandée.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Adresse non trouvée
 */
controller.get("/:id", async (req, res, next) => {
    try {
        const address = await AddressService.getOne(Number(req.params.id));
        res.json(address);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Récupérer toutes les adresses
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Liste de toutes les adresses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
controller.get("/", async (req, res, next) => {
    try {
        const addresses = await AddressService.getAll();
        res.json(addresses);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Mettre à jour une adresse existante
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de l'adresse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Adresse mise à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Adresse non trouvée
 */
controller.put("/:id", async (req, res, next) => {
    try {
        const updatedAddress = await AddressService.updateOne(Number(req.params.id), req.body);
        res.json(updatedAddress);
    } catch (error) {
        if (error instanceof InvalidArgumentError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Supprimer une adresse
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de l'adresse
 *     responses:
 *       204:
 *         description: Confirmation de la suppression de l'adresse.
 *       404:
 *         description: Adresse non trouvée
 */
controller.delete("/:id", async (req, res, next) => {
    try {
        await AddressService.deleteOne(Number(req.params.id));
        res.status(204).end();
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

module.exports = controller;
