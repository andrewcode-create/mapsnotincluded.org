const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Cluster       = require('./Cluster');

// This is the data for each asteriod
const Asteroid = sequelize.define('Asteroid', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    coordinate: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Cluster',  // Refers to the Cluster model
            key: 'coordinate'
        }
    },


    name: {
        type: DataTypes.STRING,
        allowNull: false
        //TODO add validation
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
}, {
    freezeTableName: true
});

module.exports = Asteroid;