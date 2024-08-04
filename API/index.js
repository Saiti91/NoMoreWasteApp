const express = require("express");
const bodyParser = require("body-parser");
const errorHandlingMiddleware = require("./common/middlewares/error_middleware");
const usersController = require("./users/controller");
const authController = require("./auth/controller");
const idParamGuard = require("./common/middlewares/id_param_guard_middleware");
const authMiddleware = require("./common/middlewares/auth_middleware");
const cors = require("cors");

const app = express();
const port = 3000;

// Transform le json en un objet utilisable dans le code
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Remplacez par le domaine de votre application front-end
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Authorization'
}));

// Transform le token en un objet utilisable dans le code
app.use(authMiddleware);

// Regex
app.use("/*/[1-9]+$", idParamGuard);

//Récupère la requète et délivre un message de base si celle-ci ne contient pas d'argument
app.get("/", (_req, res) => {
    res.json({
        message: "Welcome to PCS API!",
        routes: ["/users", "/auth", "/apartments", "/reservations", "/services", "/calendar", "/commentary",
            "/apartmentsCalendar", "/servicesCalendar", "/inventory", "/tickets", "/invoices"],
    });
});

// importation des autres scripts
app.use("/auth", authController);
app.use("/users", usersController);

//Pour stripe
// app.use('/stripe', stripeRoutes);

// Middleware de gestion des erreurs
app.use(errorHandlingMiddleware);

//Console
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
