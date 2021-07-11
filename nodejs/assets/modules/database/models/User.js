const { sequelize, Model, DataTypes } = require('../../sequelize');

class User extends Model {
  getFullname(){
    return [this.firstname, this.lastname].join(' ');
  }
}

User.init({
    id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Invalid Email.",
            },
        },
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["student", "junior", "mid", "senior", "manager", "admin"],
        defaultValue: "student",
    },
}, { sequelize, modelName: 'User', tableName: 'users', updatedAt: 'updated_at', createdAt: 'created_at', });

module.exports = User;