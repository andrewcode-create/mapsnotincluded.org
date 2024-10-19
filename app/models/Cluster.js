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
    vanilla: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    spacedOut: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    frostyPlanet: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});


module.exports = Cluster;

