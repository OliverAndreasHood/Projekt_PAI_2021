const { sequelize, Model, DataTypes } = require('../../sequelize');

class UserProjects extends Model {}

UserProjects.init({

}, { sequelize, modelName: 'UserProjects', tableName: 'userprojects', updatedAt: false, createdAt: 'created_at', });

module.exports = UserProjects;