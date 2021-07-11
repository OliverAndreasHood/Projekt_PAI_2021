// Main nodejs server file/module

require('dotenv').config();
const express = require('express');
const sq = require('./assets/modules/sequelize');
const db_setup = require('./assets/modules/database/setup');
const cors = require('cors');
const formidable = require('express-formidable');
const app = express();
const jwt = require('./assets/modules/jwt');
const errorHandler = require('./assets/modules/errorhandler');
const api = require('./assets/modules/api');
const socket = require('./assets/modules/socket');
const UserController = require('./assets/modules/controllers/UserController');

app.use(formidable()); // Middleware for request fields parsing
app.use(cors()); // Middleware for request cors
app.options('*', cors());
app.use(jwt()); // Middleware for token authentication to secure the api
app.use('/', api); // Middleware to handle api requests
app.use(errorHandler); // Middleware to return error responses

// Server
const server = app.listen(process.env.PORT, function () {
  console.log('Server listening on port ' + process.env.PORT);
});

start();

async function start(){
  const connectedToDB = await sq.functions.connect(); // Connect to database

  if(connectedToDB){ // When connected to database
    //await db_setup.functions.alterTables(true, false); // Run this to create or alter tables. To create pass (true, false) & To alter pass (false, true).
    await db_setup.functions.refreshRelationshipMemory(); // Setup/refresh model relationships. Comment this when running alterTables. If not running alterTables always uncomment this
    console.log("Model relationships have been setup successfully.");

    await socket.setupIO(server); // Start socket.io
    console.log("Socket started.");

    //console.log(await UserController.newAdmin("admin", "user", "admin@admin.com", "1234567890")); // Use this by uncommenting, to create new admin account.
  }
}