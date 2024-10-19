const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Save          = require('./Save');


// This is the data for geysers
const Geyser = sequelize.define('Geyser', {
    x: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    y: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    element: {
        type: DataTypes.ENUM,
        values: [
            'CarbonDioxide',       'ChlorineGas',
            'Hydrogen',            'Steam',
            'DirtyWater',          'CrudeOil',
            'ContaminatedOxygen',  'Methane',
            'LiquidCarbonDioxide', 'SaltWater',
            'Magma',               'Brine',
            'MoltenCopper',        'Water',
            'MoltenIron',          'MoltenGold',
            // TODO: Add more
        ],
        allowNull: false
    },
    AvgEmissionPerSecond: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
});

module.exports = Geyser;