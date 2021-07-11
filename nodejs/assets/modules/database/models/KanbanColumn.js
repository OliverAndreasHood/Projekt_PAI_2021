const { sequelize, Model, DataTypes } = require('../../sequelize');

class KanbanColumn extends Model {

}

KanbanColumn.init({
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

    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize, modelName: 'KanbanColumn', tableName: 'kanbans_columns', updatedAt: 'updated_at', createdAt: 'created_at', });

module.exports = KanbanColumn;