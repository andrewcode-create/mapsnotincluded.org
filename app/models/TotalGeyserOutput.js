const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Save          = require('./Save');
const Geyser = require('./Geyser');


const TotalGeyserOutput = sequelize.define('TotalGeyserOutput', {



    //geysers and vents
    AluminunVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AluminunVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CO2GeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CO2GeyserTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CO2VentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CO2VentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ChlorineVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ChlorineVentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CobaltVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CobaltVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CoolSaltSlushCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CoolSaltSlushTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CoolSlushCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CoolSlushTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CoolSteamVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CoolSteamVentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CopperVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CopperVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    GoldVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    GoldVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    HotPo2VentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    HotPo2VentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    HydrogenVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    HydrogenVentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    IPo2VentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IPo2VentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    IronVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IronVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    LeakyOilFissureCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    LeakyOilFissureTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    LiquidSulferCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    LiquidSulferTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    MinorVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MinorVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    NaturalGasGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NaturalGasGeyserTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    NaturalGasVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NaturalGasVentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    NiobiumVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NiobiumVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    PollutedWwaterVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PollutedWwaterVentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SaltWaterGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SaltWaterGeyserTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SteamGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SteamGeyserTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SteamVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SteamVentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    TungstenVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TungstenVolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    VolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    VolcanoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    WaterGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    WaterGeyserTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    OilWellCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    OilWellTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },


    //accumulators
    WaterAccumulation: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    OilAccumulation: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    MagmaAccumulation: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

})


module.exports = TotalGeyserOutput;