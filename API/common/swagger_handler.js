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
            description: "API for NoMoreWaste",
        },
    },
    apis: [
        path.join(basePath, "auth", "*.js"),
        path.join(basePath, "users", "*.js"),
        path.join(basePath, "Subscriptions", "*.js"),
        path.join(basePath, "index.js"),
        path.join(basePath, "stocks", "*.js"),
        path.join(basePath, "donations", "*.js"),
        path.join(basePath, "tours", "*.js"),
        path.join(basePath, "Destination", "*.js"),
        path.join(basePath, "Requests", "*.js"),
        path.join(basePath, "Categories", "*.js"),
        path.join(basePath, "Products", "*.js"),
        path.join(basePath, "productCategories", "*.js"),
        path.join(basePath, "trucks", "*.js"),
        path.join(basePath, "recipes", "*.js"),
        path.join(basePath, "skills", "*.js"),
        path.join(basePath, "tickets", "*.js"),
        path.join(basePath, "Registrations", "*.js"),
    ],

};

const specs = swaggerJsdoc(options);

module.exports = {specs};
