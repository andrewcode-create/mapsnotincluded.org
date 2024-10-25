const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');


const Dlc = sequelize.define('Dlc', {
    vanilla: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    coordinate: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Cluster',  // Refers to the Cluster model
            key: 'coordinate'
        },
        unique: true,
        primaryKey: true
    },
    spacedOut: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    frostyPlanet: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    validate: { 
        correctVanilla: function() {
            if(this.vanilla === true && (this.spacedOut === true || this.frostyPlanet === true)) {
                throw new Error("Cannot be both Vanilla and have DLC active");
            }
        }
    },
    freezeTableName: true,
    timestamps: false //no timestamps for creation and updating.
})

//module.exports = Dlc;