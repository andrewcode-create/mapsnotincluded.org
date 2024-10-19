const { DataTypes } = require('sequelize');
const sequelize     = require('../lib/database');
const Save          = require('./Cluster');
const Geyser = require('./Geyser');


const TotalGeyserOutput = sequelize.define('TotalGeyserOutput', {



    //geysers and vents
    AluminunVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AluminunVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CO2GeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CO2GeyserTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CO2VentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CO2VentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ChlorineVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ChlorineVentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CobaltVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CobaltVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CoolSaltSlushCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CoolSaltSlushTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CoolSlushCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CoolSlushTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CoolSteamVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CoolSteamVentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CopperVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CopperVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    GoldVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    GoldVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    HotPo2VentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    HotPo2VentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    HydrogenVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    HydrogenVentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    IPo2VentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IPo2VentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    IronVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IronVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    LeakyOilFissureCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    LeakyOilFissureTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    LiquidSulferCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    LiquidSulferTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    MinorVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MinorVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    NaturalGasGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NaturalGasGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    NaturalGasVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NaturalGasVentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    NiobiumVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NiobiumVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    PollutedWwaterVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PollutedWwaterVentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SaltWaterGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SaltWaterGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SteamGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SteamGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SteamVentCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SteamVentTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    TungstenVolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TungstenVolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    VolcanoCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    VolcanoTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    WaterGeyserCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    WaterGeyserTotalOutput: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    OilWellCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    OilWellTotalOutput: {
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