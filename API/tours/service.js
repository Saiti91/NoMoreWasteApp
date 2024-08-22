const tourRepository = require("./repository");
const { InvalidArgumentError } = require("../common/service_errors");

async function createOne(data) {
    let tourId;
    if (data.Type) {
        // Call the method for 'collect'
        tourId = tourRepository.createCollectOne(data);
    } else {
        // Call the method for 'distribute'
        tourId = tourRepository.createDistributionOne(data);
    }
    return { routeId: tourId };
}

async function getOne(id) {
    const tour = await tourRepository.getOne(id);
    if (!tour) {
        throw new InvalidArgumentError(`Tour with ID ${id} not found`);
    }
    return tour;
}

async function getAllRoutesForUser(id) {
    if (id === undefined) {
        throw new Error("getOneProduct: Product_ID must be defined");
    }
    const tour = await tourRepository.getAllRoutesForUser(id);
    if (!tour) {
        throw new InvalidArgumentError(`Tour with ID ${id} not found`);
    }
    return tour;
}

async function getAll() {
    const tours = await tourRepository.getAll();
    return tours;
}

async function updateOne(id, data) {
    const updatedTour = await tourRepository.updateOne(id, data);
    return updatedTour;
}

async function deleteOne(id) {
    const result = await tourRepository.deleteOne(id);
    return result;
}

async function addDestination(routeId, destinationData) {
    const destinationId = await tourRepository.addDestination(routeId, destinationData);
    return { destinationId };
}

async function removeDestination(routeId, destinationId) {
    await tourRepository.removeDestination(routeId, destinationId);
}

async function addProductToDestination(destinationId, productData) {
    await tourRepository.addProductToDestination(destinationId, productData);
}

async function removeProductFromDestination(destinationId, productId) {
    await tourRepository.removeProductFromDestination(destinationId, productId);
}

module.exports = {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
    addDestination,
    removeDestination,
    addProductToDestination,
    removeProductFromDestination,
    getAllRoutesForUser
};
