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
});


module.exports = Cluster;

