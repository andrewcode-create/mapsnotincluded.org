const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');



const Cluster = sequelize.define('Cluster', {
    coordinate: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    gameVersion: {
        type: DataTypes.STRING,
        allowNull: false
    },

});


module.exports = Cluster;

