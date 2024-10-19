const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');

// This is the save file itself
const OldSave = sequelize.define('Save', {
    seed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    coordinates: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    gameVersion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    worldId: {
        type: DataTypes.STRING,
        allowNull: true
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
    worldTraits: { // Array of enums
        type: DataTypes.ARRAY(DataTypes.ENUM({
            values: [
                'BouldersMedium',
                'TrappedOil',
                'BuriedOil',
                'MetalRich',
                'BouldersMixed',
                'MagmaVents',
                'Volcanoes',
                'MetalPoor',
                'SlimeSplats',
                'BouldersLarge',
                'IrregularOil',
                'Geodes',
                'SlimeSplats',
                'FrozenCore',
                'BouldersLarge',
                'SubsurfaceOcean',
                'MisalignedStart',
                'GeoActive',
                'BouldersSmall',
                'GlaciersLarge',
                'GeoDormant',
            ]
        })),
        allowNull: false,
        
    },
});

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
    worldId: {
        type: DataTypes.STRING,
        allowNull: true
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


module.exports = World;

