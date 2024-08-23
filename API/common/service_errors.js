// Définition d'une classe d'erreur pour les erreurs liées aux arguments invalides
class InvalidArgumentError extends Error {
    constructor(message) {
        super(message || "Something went wrong with the provided data.");
        this.name = "InvalidArgumentError";  // Nom de l'erreur
        this.statusCode = 400;  // Code HTTP pour les erreurs de requête incorrecte
    }
}

// Définition d'une classe d'erreur pour les erreurs d'authentification
class AuthError extends Error {
    constructor(message) {
        super(message || "An error prevented you from authenticating.");
        this.name = "AuthError";  // Nom de l'erreur
        this.statusCode = 401;  // Code HTTP pour les erreurs d'authentification
    }
}

// Définition d'une classe d'erreur pour les erreurs d'autorisation
class UnauthorizedError extends Error {
    constructor(message) {
        super(message || "You are not allowed to perform this action.");
        this.name = "UnauthorizedError";  // Nom de l'erreur
        this.statusCode = 403;  // Code HTTP pour les actions non autorisées
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message || "Resource not found.");
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

// Exportation des classes d'erreur pour utilisation dans d'autres parties de l'application
module.exports = { InvalidArgumentError, AuthError, UnauthorizedError, NotFoundError };
