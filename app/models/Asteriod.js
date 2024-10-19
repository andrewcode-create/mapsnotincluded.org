const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Cluster       = require('./Cluster');

// This is the data for each asteriod
const Asteroid = sequelize.define('Asterioid', {
    id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    offsetX: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    offsetY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sizeX: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sizeY: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    worldTraits: {
        // enum
        type: sequelize.ARRAY(DataTypes.ENUM({
            values: [
                'BouldersLarge',
                'BouldersMedium',
                'BouldersMixed',
                'BouldersSmall',
                // TODO: Add more and make them match the JSON
            ]
        })),
        allowNull: false,
    },
});

module.exports = Asteroid;