const { sequelize, Model, DataTypes } = require('../../sequelize');

class UserOrganizations extends Model {}

UserOrganizations.init({

}, { sequelize, modelName: 'UserOrganizations', tableName: 'userorganizations', updatedAt: false, createdAt: 'created_at', });

module.exports = UserOrganizations;