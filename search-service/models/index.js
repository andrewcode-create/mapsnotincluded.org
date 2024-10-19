//const File = require('./File');
const Cluster = require('./Cluster');
const Dlc = require('./Dlc')
const TotalGeyserOutput = require('./TotalGeyserOutput');
const Asteroid = require('./Asteroid')


Asteroid.hasOne(TotalGeyserOutput, {
    foreignKey: 'asteroidId',
    sourceKey: 'id'
});

Cluster.hasOne(TotalGeyserOutput, {
    foreignKey: 'clusterId',
    sourceKey: 'coordinate'
});

Cluster.hasOne(Dlc, {
    foreignKey: 'coordinate',
    sourceKey: 'coordinate'
});

Cluster.hasMany(Asteroid, {
    foreignKey: 'coordinate',
    sourceKey: 'coordinate'
});

module.exports = {
    Cluster,
    Dlc,
    Asteroid,
    TotalGeyserOutput,
}