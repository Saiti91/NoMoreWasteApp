const express = require('express');
const AddressService = require('./service');
const { InvalidArgumentError, NotFoundError } = require('../common/service_errors');

const router = express.Router();

// Créer une nouvelle adresse
router.post('/addresses', async (req, res, next) => {
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

// Récupérer une adresse par ID
router.get('/addresses/:id', async (req, res, next) => {
    try {
        const address = await AddressService.getOne(req.params.id);
        res.status(200).json(address);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

// Récupérer toutes les adresses
router.get('/addresses', async (req, res, next) => {
    try {
        const addresses = await AddressService.getAll();
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
});

// Mettre à jour une adresse
router.put('/addresses/:id', async (req, res, next) => {
    try {
        const updatedAddress = await AddressService.updateOne(req.params.id, req.body);
        res.status(200).json(updatedAddress);
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

// Supprimer une adresse par ID
router.delete('/addresses/:id', async (req, res, next) => {
    try {
        await AddressService.deleteOne(req.params.id);
        res.status(204).end();
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

module.exports = router;
