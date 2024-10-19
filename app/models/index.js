//const File = require('./File');
const World = require('./Cluster');
const Geyser = require('./Geyser');
const TotalGeyserOutput = require('./TotalGeyserOutput');


Asteriod.hasOne(TotalGeyserOutput, {
    foreignKey: 'coordinate'
});

Cluster.hasOne(TotalGeyserOutput, {
    foreignKey: 'coordinate'
});

Cluter.hasMany(Asteriod, {
    foreignKey: 'coordinate'
});

Asteriod.hasMany(Geyser, {
    foreignKey: 'coordinate'
});


// First time using sequelise, this doesn't make much sense to me as the ID is on the correct table but syntactically i would expect a save to have one file?
/*
File.hasOne(Save, {
    foreignKey: 'fileId'
});
*/

module.exports = {
    Geyser,
    Cluster,
    TotalGeyserOutput,
    //File,
}