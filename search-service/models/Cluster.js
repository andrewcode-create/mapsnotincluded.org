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
    
}, {
    freezeTableName: true,
    timestamps: false //no timestamps for creation and updating.
});


module.exports = Cluster;

