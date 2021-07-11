// Module for setting up sequelize.js (Library used for handling database queries)

require('dotenv').config();
const { Sequelize, DataTypes, Model, Op } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql'
});

async function connect(){
    try{
        await sequelize.authenticate();
        console.log('Connection with database has been established successfully.');

        return true;
    }catch (error) {
        console.error('Unable to connect to the database:', error.original.sqlMessage);
        return false;
    }
}

module.exports = {
    sequelize, 
    DataTypes, 
    Model,
    Op,
    functions: {
        connect,
    },
};