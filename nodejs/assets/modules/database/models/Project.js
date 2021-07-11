const { sequelize, Model, DataTypes } = require('../../sequelize');

class Project extends Model {

}

Project.init({
    id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, { sequelize, modelName: 'Project', tableName: 'projects', updatedAt: 'updated_at', createdAt: 'created_at', });

module.exports = Project;