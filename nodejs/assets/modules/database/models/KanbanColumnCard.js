const { sequelize, Model, DataTypes } = require('../../sequelize');

class KanbanColumnCard extends Model {

}

KanbanColumnCard.init({
    id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    importance: {
        type: DataTypes.ENUM,
        values: ["1","2","3","4","5"],
        defaultValue: "1",
        allowNull: false,
    },

    color: {
        type: DataTypes.ENUM,
        values: ["black", "#084c61"],
        defaultValue: "#084c61",
        allowNull: false,
    },
}, { sequelize, modelName: 'KanbanColumnCard', tableName: 'kanbans_columns_cards', updatedAt: 'updated_at', createdAt: 'created_at', });

module.exports = KanbanColumnCard;