const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Cluster       = require('./Cluster');


// has geyser counts, average geyser outputs, and aggregete water/oil/magma outputs
const TotalGeyserOutput = sequelize.define('TotalGeyserOutput', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clusterId: {
        type: DataTypes.STRING,
        allowNull: true,  // This will be null for asteroids' outputs
        references: {
            model: 'Cluster',  // Refers to the Cluster model
            key: 'coordinate'
        },
        unique: true  // Ensure one-to-one relationship for the cluster
    },
    asteroidId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // This will be null for cluster's total output
        references: {
            model: 'Asteroid',  // Refers to the Asteroid model
            key: 'id'
        },
        unique: true  // Ensure one-to-one relationship for the asteroid
    },

    
    //geysers and vents
    
    OilWell_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    OilWell_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    salt_water_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    salt_water_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    steam_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    steam_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    chlorine_gas_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    chlorine_gas_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    methane_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    methane_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    molten_iron_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    molten_iron_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    molten_cobalt_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    molten_cobalt_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    hot_steam_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    hot_steam_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    slush_water_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    slush_water_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    liquid_sulfur_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    liquid_sulfur_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    hot_water_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    hot_water_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    slimy_po2_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    slimy_po2_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    hot_po2_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    hot_po2_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    filthy_water_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    filthy_water_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    liquid_co2_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    liquid_co2_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    slush_salt_water_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    slush_salt_water_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    molten_gold_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    molten_gold_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    molten_tungsten_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    molten_tungsten_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    molten_niobium_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    molten_niobium_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    big_volcano_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    big_volcano_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    molten_aluminum_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    molten_aluminum_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    molten_copper_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    molten_copper_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    small_volcano_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    small_volcano_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    hot_hydrogen_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    hot_hydrogen_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    hot_co2_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    hot_co2_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    oil_drip_Count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    oil_drip_TotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },


    //accumulators
    WaterAccumulation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        /*
        validate: {
            require_not_init(value) {
                if(!(value === undefined || value === null)) {
                    throw new Error("Accumulation should not be initialy defined. It will be autmatically calculated.");
                }
            }
        }
        */
    },
    OilAccumulation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        /*
        validate: {
            require_not_init(value) {
                if(!(value === undefined || value === null)) {
                    throw new Error("Accumulation should not be initialy defined. It will be autmatically calculated.");
                }
            }
        }
        */
    },
    MagmaAccumulation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        /*
        validate: {
            require_not_init(value) {
                if(!(value === undefined || value === null)) {
                    throw new Error("Accumulation should not be initialy defined. It will be autmatically calculated.");
                }
            }
        }
        */
    },
    

}, {
    //TODO have hook change value of accululators using new geyser names
    
    hooks: {
        beforeValidate: function(instance) {
            //TODO add salt water and polluted water to the water accumulation
            instance.WaterAccumulation = instance.steam_TotalOutput + instance.hot_steam_TotalOutput + instance.hot_water_TotalOutput + instance.filthy_water_TotalOutput + instance.salt_water_TotalOutput + instance.slush_salt_water_TotalOutput + instance.slush_water_TotalOutput
            instance.OilAccumulation = instance.OilWell_TotalOutput + instance.oil_drip_TotalOutput
            instance.MagmaAccumulation = instance.small_volcano_TotalOutput + instance.big_volcano_TotalOutput
        }
    },
    
    
    freezeTableName: true,
    timestamps: false //no timestamps for creation and updating.
})


module.exports = TotalGeyserOutput;