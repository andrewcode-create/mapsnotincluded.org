const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Save          = require('./Cluster');
const Geyser = require('./Geyser');

// This is the data for each asteriod
const Geyser = sequelize.define('Asterioid', {
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
        type: DataTypes.ENUM,
        values: [
            'MetalRich',
            'MetalPoor',
            'MagmaVents',
            // TODO: Add more and make them match the JSON
        ],
        allowNull: false
    },
});

module.exports = Asteroid;