// Module to setup authorization token requirments

require('dotenv').config();
const expressJwt = require('express-jwt');

function jwt() {
    const secret = process.env.TOKEN_KEY;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // Routes which don't need user to be authenticated go here
            '/user/login',
        ]
    });
}

module.exports = jwt;