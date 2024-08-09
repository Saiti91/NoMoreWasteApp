const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const basePath = path.join(__dirname, "..");

const options = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NoMoreWasteAPI",
            version: "1.0.0",
            description: "This API allows managing apartments for a company renting private people's properties.",
        },
    },
    apis: [
        path.join(basePath, "auth", "*.js"),
        path.join(basePath, "users", "*.js"),
        path.join(basePath, "index.js"),
        path.join(basePath, "stocks", "*.js"),
        path.join(basePath, "donations", "*.js"),
        path.join(basePath, "tours", "*.js"),
        path.join(basePath, "Destination", "*.js"),],
};

const specs = swaggerJsdoc(options);

module.exports = { specs };
