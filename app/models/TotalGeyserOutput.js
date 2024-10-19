const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Save          = require('./Cluster');
const Geyser = require('./Geyser');


const TotalGeyserOutput = sequelize.define('TotalGeyserOutput', {



    //geysers and vents
    AluminunVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    AluminunVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    CO2GeyserCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    CO2GeyserTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    CO2VentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    CO2VentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    ChlorineVentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    ChlorineVentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    CobaltVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    CobaltVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    CoolSaltSlushCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    CoolSaltSlushTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    CoolSlushCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    CoolSlushTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    CoolSteamVentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    CoolSteamVentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    CopperVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    CopperVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    GoldVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    GoldVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    HotPo2VentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    HotPo2VentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    HydrogenVentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    HydrogenVentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    IPo2VentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    IPo2VentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    IronVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    IronVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    LeakyOilFissureCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    LeakyOilFissureTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    LiquidSulferCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    LiquidSulferTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    MinorVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    MinorVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    NaturalGasGeyserCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    NaturalGasGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    NaturalGasVentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    NaturalGasVentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    NiobiumVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    NiobiumVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    PollutedWwaterVentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    PollutedWwaterVentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    SaltWaterGeyserCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    SaltWaterGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    SteamGeyserCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    SteamGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    SteamVentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    SteamVentTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    TungstenVolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    TungstenVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    VolcanoCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    VolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    WaterGeyserCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    WaterGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    OilWellCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    OilWellTotalOutput: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
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