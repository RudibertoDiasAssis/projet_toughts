const { DataType, DataTypes } = require('sequelize');

const db = require('../db/conn');

const User = require('./User');

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})
// Um pensamento tem apenas um usuários
Tought.belongsTo(User)
// um usuário pode ter vários pensamentos
User.hasMany(Tought);

module.exports = Tought;