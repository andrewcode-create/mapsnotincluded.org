const Cluster = require('./Cluster');
const Dlc = require('./Dlc')
const TotalGeyserOutput = require('./TotalGeyserOutput');
const Asteroid = require('./Asteroid')

const setAssociations = () => {
    // Cluster <-> Asteroid (One-to-Many)
    Cluster.hasMany(Asteroid, {
        foreignKey: 'coordinate',
        sourceKey: 'coordinate',
    });

    Asteroid.belongsTo(Cluster, {
        foreignKey: 'coordinate',
    });


    // Cluster <-> TotalGeyserOutput (One-to-One)
    Cluster.hasOne(TotalGeyserOutput, {
        foreignKey: 'clusterId',
        sourceKey: 'coordinate'
    });

    TotalGeyserOutput.belongsTo(Cluster, {
        foreignKey: 'clusterId'
    });


    // Asteroid <-> TotalGeyserOutput (One-to-One)
    Asteroid.hasOne(TotalGeyserOutput, {
        foreignKey: 'asteroidId',
        sourceKey: 'id'
    });

    TotalGeyserOutput.belongsTo(Asteroid, {
        foreignKey: 'asteroidId'
    });


    // Cluster <-> Dlc (One-to-One)
    Cluster.hasOne(Dlc, {
        foreignKey: 'coordinate',
        sourceKey: 'coordinate'
    });

    Dlc.belongsTo(Cluster, {
        foreignKey: 'coordinate',
    });
}

module.exports = {
    Cluster,
    Dlc,
    Asteroid,
    TotalGeyserOutput,
    setAssociations,
}