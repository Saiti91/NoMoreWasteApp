const { createTruckSchema, updateTruckSchema } = require("./model");
const truckRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Fonction de création d'un camion (Truck)
async function createTruck(truckData) {
    // Valider les données du camion
    const { error } = createTruckSchema.validate(truckData);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Créer le camion
    const createdTruck = await truckRepository.createTruck(truckData);
    return createdTruck;
}

// Fonction de récupération d'un camion par son ID
async function getOneTruck(id) {
    if (id === undefined) {
        throw new InvalidArgumentError("Truck ID must be defined");
    }
    const truck = await truckRepository.getTruckById(id);
    if (!truck) {
        throw new Error(`Truck with ID ${id} does not exist`);
    }
    return truck;
}

// Fonction de récupération de tous les camions
async function getAllTrucks() {
    const trucks = await truckRepository.getAllTrucks();
    return trucks;
}

async function getAvailableTrucksToday() {
    const trucks = await truckRepository.getAvailableTrucksToday();
    return trucks;
}

// Fonction de mise à jour d'un camion par son ID
async function updateTruck(id, truckData) {
    // Valider les données du camion
    const { error } = updateTruckSchema.validate(truckData);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Vérifier l'existence du camion
    const existingTruck = await getOneTruck(id);
    if (!existingTruck) {
        throw new Error(`Truck with ID ${id} does not exist`);
    }

    // Mettre à jour le camion
    const updatedTruck = await truckRepository.updateTruck(id, truckData);
    return updatedTruck;
}

// Fonction de suppression d'un camion
async function deleteTruck(id, issuer) {
    const truck = await getOneTruck(id);
    if (!truck) {
        throw new Error(`Truck with ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("You cannot delete a truck unless you are an administrator.");
    }
    return await truckRepository.deleteTruck(id);
}

module.exports = { createTruck, getOneTruck, getAvailableTrucksToday, getAllTrucks, updateTruck, deleteTruck };
