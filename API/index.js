const express = require("express");
const bodyParser = require("body-parser");
const errorHandlingMiddleware = require("./common/middlewares/error_middleware");

const idParamGuard = require("./common/middlewares/id_param_guard_middleware");
const authMiddleware = require("./common/middlewares/auth_middleware");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { specs } = require("./common/swagger_handler");

// Importation des contrôleurs
const usersController = require("./users/controller");
const authController = require("./auth/controller");
const stockController= require ("./stocks/controller");
const donationController= require ("./donations/controller");
const tourController= require ("./tours/controller");
const ticketsController = require("./tickets/controller");
const stripeRoutes = require('./stripe/stripeRoutes');
const requestController = require("./requests/controller");
const productsController = require("./products/controller");
const productsCategoriesController = require("./productCategories/controller");
const trucksController = require("./trucks/controller");
const recipesController = require("./recipes/controller");
const skillsController = require("./skills/controller");
const subscriptionsController = require("./subscriptions/controller");
const addressesController = require("./addresses/controller");
const registrationsController = require("./registrations/controller");

const app = express();
const port = 3000;

app.use('/uploads/recipes', express.static('uploads/recipes'));

// Transforme le JSON en un objet utilisable dans le code
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Authorization'
}));

// Transforme le token en un objet utilisable dans le code
app.use(authMiddleware);

// Route de base
app.get("/", (_req, res) => {
    res.json({
        message: "Welcome to PCS API!",
        routes: ["/users", "/auth","/stocks", "/api-docs", "/donations","/tours",
            "/tickets","/categories","/stripe","/requests","/products",
            "/productsCategories","/trucks","/recipes", "/skills", "/subscriptions", "/addresses", "/registrations"],
    });
});

// Route Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Importation des autres scripts
app.use("/auth", authController);
app.use("/stocks", stockController);
app.use("/users", usersController);
app.use("/donations", donationController);
app.use("/tours", tourController);
app.use("/tickets", ticketsController);
app.use("/requests", requestController);
app.use("/products", productsController);
app.use("/productsCategories", productsCategoriesController);
app.use("/trucks", trucksController);
app.use("/recipes", recipesController);
app.use("/skills", skillsController);
app.use("/subscriptions", subscriptionsController);
app.use("/addresses", addressesController);
app.use("/registrations", registrationsController);

// Application du middleware `idParamGuard` aux routes avec paramètre `id`
app.use("/users/:id", idParamGuard);
app.use("/stocks/:id", idParamGuard);
app.use("/auth/:id", idParamGuard);
app.use("/donations/:id", idParamGuard);
app.use("/tours/:id", idParamGuard);
app.use("/tickets/:id", idParamGuard);
app.use("/requests/:id", idParamGuard);
app.use("/products/:id", idParamGuard);
app.use("/productsCategories/:id", idParamGuard);
app.use("/trucks/:id", idParamGuard);
app.use("/recipes/:id", idParamGuard);
app.use("/skills/:id", idParamGuard);

//Stripe
app.use('/stripe', stripeRoutes);

// Middleware de gestion des erreurs
app.use(errorHandlingMiddleware);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
