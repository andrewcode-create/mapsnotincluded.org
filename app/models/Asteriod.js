const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Cluster       = require('./Cluster');

// This is the data for each asteriod
const Asteroid = sequelize.define('Asterioid', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
        //TODO add validation
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
        type: DataTypes.ARRAY(DataTypes.ENUM({
            values: [
                'BouldersLarge',
                'BouldersMedium',
                'BouldersMixed',
                'BouldersSmall',
                // TODO: Add more and make them match the JSON
            ]
        })),
        validate: {
            maxSize4(value) {
                if(value.length > 4) {
                    throw new Error("this asteroid has more than 4 world traits");
                }
            }
            //TODO add validation for conficting traits
        },
        allowNull: false,
    },
});

module.exports = Asteroid;