const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');


const Dlc = sequelize.define('Dlc', {
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
})

module.exports = Dlc;