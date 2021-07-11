const { sequelize, Model, DataTypes } = require('../../sequelize');

class Organization extends Model {}

Organization.init({
    id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, { sequelize, modelName: 'Organization', tableName: 'organizations', updatedAt: 'updated_at', createdAt: 'created_at', });

module.exports = Organization;