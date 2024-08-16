const requestsRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");

// Create a new request
async function createOne(request) {
    await requestsRepository.createOne(request);
}

// Get requests by User ID
async function getOneUserID(id) {
    if (id === undefined) {
        throw new Error("getOneUserID: ID must be defined");
    }
    const request = await requestsRepository.getOneBy('User_ID', id);
    return request ? { ...request } : null;
}

// Get requests by Date
async function getOneByDate(date) {
    if (date === undefined) {
        throw new Error("getOneByDate: Date must be defined");
    }
    const request = await requestsRepository.getOneBy('Date', date);
    return request ? { ...request } : null;
}

// Get a single request by ID
async function getOneRequest(id) {
    if (id === undefined) {
        throw new Error("getOneRequest: ID must be defined");
    }
    const request = await requestsRepository.getOneBy('Request_ID', id);
    return request ? { ...request } : null;
}

// Get requests by Product ID
async function getOneProduct(id) {
    if (id === undefined) {
        throw new Error("getOneProduct: Product_ID must be defined");
    }
    const request = await requestsRepository.getOneBy('Product_ID', id);
    return request ? { ...request } : null;
}

// Get all requests
async function getAll() {
    const requests = await requestsRepository.getAll();
    return requests.map(request => ({ ...request }));
}

// Update a request by ID
async function updateOne(id, data) {
    // Validation of the request
    // Assuming you have some validation schema for `Request`
    // const { error } = updateRequestSchema.validate(data);
    // if (error) {
    //     throw new Error(error.details[0].message);
    // }

    // Check if the request exists
    const existing = await requestsRepository.getOneBy("Request_ID", id);
    if (!existing) {
        throw new Error(`Request with Request_ID ${id} does not exist`);
    }

    // Update the request
    const updated = await requestsRepository.updateOne(id, data);
    return updated ? { ...updated } : null;
}

// Delete a request by ID
async function deleteOne(id, issuer) {
    const request = await requestsRepository.getOneBy("Request_ID", id);
    if (!request) {
        throw new Error(`Request with Request_ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("You do not have permission to delete this request.");
    }
    return await requestsRepository.deleteOne(id);
}

module.exports = { createOne, getOneRequest, getOneUserID, getOneProduct, getOneByDate, getAll, updateOne, deleteOne };
