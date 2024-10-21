const Cluster = require('./Cluster');
const Dlc = require('./Dlc')
const TotalGeyserOutput = require('./TotalGeyserOutput');
const Asteroid = require('./Asteroid')

const setAssociations = () => {
    // Cluster <-> Asteroid (One-to-Many)
    Cluster.hasMany(Asteroid, {
        foreignKey: 'coordinate',
        sourceKey: 'coordinate',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    Asteroid.belongsTo(Cluster, {
        foreignKey: 'coordinate',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });


    // Cluster <-> TotalGeyserOutput (One-to-One)
    Cluster.hasOne(TotalGeyserOutput, {
        foreignKey: 'clusterId',
        sourceKey: 'coordinate',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    TotalGeyserOutput.belongsTo(Cluster, {
        foreignKey: 'clusterId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });


    // Asteroid <-> TotalGeyserOutput (One-to-One)
    Asteroid.hasOne(TotalGeyserOutput, {
        foreignKey: 'asteroidId',
        sourceKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    TotalGeyserOutput.belongsTo(Asteroid, {
        foreignKey: 'asteroidId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });


    // Cluster <-> Dlc (One-to-One)
    Cluster.hasOne(Dlc, {
        foreignKey: 'coordinate',
        sourceKey: 'coordinate',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    Dlc.belongsTo(Cluster, {
        foreignKey: 'coordinate',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
}

module.exports = {
    Cluster,
    Dlc,
    Asteroid,
    TotalGeyserOutput,
    setAssociations,
}