const { sequelize, Model, DataTypes } = require('../../sequelize');

class Kanban extends Model {

}

Kanban.init({
    id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
}, { sequelize, modelName: 'Kanban', tableName: 'kanbans', updatedAt: 'updated_at', createdAt: 'created_at', });

module.exports = Kanban;