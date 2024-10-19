const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');



const Cluster = sequelize.define('Cluster', {
    coordinate: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
        //TODO add validation
    },
    gameVersion: {
        type: DataTypes.STRING,
        allowNull: false
        //TODO add validation
    },
});


module.exports = Cluster;

