//const File = require('./File');
const Cluster = require('./Cluster');
const Dlc = require('./Dlc')
const TotalGeyserOutput = require('./TotalGeyserOutput');
const Asteroid = require('./Asteroid')


Asteroid.hasOne(TotalGeyserOutput, {
    foreignKey: 'coordinate'
});

Cluster.hasOne(TotalGeyserOutput, {
    foreignKey: 'coordinate'
});

Cluster.hasOne(Dlc, {
    foreignKey: 'coordinate'
});

Cluster.hasMany(Asteroid, {
    foreignKey: 'coordinate'
});

module.exports = {
    Cluster,
    Dlc,
    Asteroid,
    TotalGeyserOutput,
}