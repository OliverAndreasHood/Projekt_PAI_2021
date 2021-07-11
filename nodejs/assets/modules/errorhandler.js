// Module for returing default errors called from functions handling the requests

function errorHandler(error, request, response, next) {
    if (typeof (error) === 'string') {
        return response.status(400).json({ message: error });
    }

    if (error.name === 'UnauthorizedError') {
        return response.status(401).json({ message: 'Invalid Token' });
    }

    return response.status(500).json({ message: error.message });
}

module.exports = errorHandler;