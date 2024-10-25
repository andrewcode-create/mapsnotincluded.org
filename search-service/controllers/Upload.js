const express = require('express');
const router = express.Router();
const sequelize = require('../lib/database')
const { Cluster, Dlc, Asteroid, TotalGeyserOutput, setAssociations } = require('../models/index')
const { Queue } = require('async-await-queue');

const uploadSingleJson = async (jsonOld, numtoPrint) => {
    numtoPrint = numtoPrint | 0
    const transaction = await sequelize.transaction();
    try {
        const newCluster = await Cluster.create({
            coordinate: jsonOld.coordinate,
            gameVersion: "0"  // TODO
        }, {
            transaction:transaction
        });

        await Dlc.create({
            coordinate: jsonOld.coordinate,
            vanilla: jsonOld["dlcs"].length === 0,
            spacedOut: jsonOld["dlcs"].includes("SpacedOut"),
            frostyPlanet: jsonOld["dlcs"].includes("FrostyPlanet"),
        }, {
            transaction:transaction
        });


        const asteroidBulkData = jsonOld.asteroids.map(asteroidData => ({
            coordinate: newCluster.coordinate,
            name: asteroidData.id,
            worldTraits: asteroidData.worldTraits
        }));

        const createdAsteroids = await Asteroid.bulkCreate(asteroidBulkData, { transaction });
       
        const totalGeyserOutputBulkData = createdAsteroids.map(asteroid => ({
            clusterId: null, // this is left null for now as per your logic
            asteroidId: asteroid.id, // link it to the asteroid
            //TODO add geysers, default to 0 for now
        }));

        gs = await TotalGeyserOutput.bulkCreate(totalGeyserOutputBulkData, { transaction });

        
        await TotalGeyserOutput.create({
            clusterId: newCluster.coordinate,
            asteroidId: null,
            //TODO sum all geysers in gs and append. For now default to 0
        }, {
            transaction:transaction
        });
        
        transaction.commit();
        console.log(`${numtoPrint}: New Cluster uploaded: ${newCluster.coordinate}`)
        return newCluster; // Return newly created cluster or some status

    } catch (error) {
        console.error("Error while uploading data: ", error);
        transaction.rollback()
        throw error;
    }
};

let database_initialized = false;
let database_init_promise = null;
const initializeDatabase = async () => {
    console.log("try initialization")
    // If already initialized, return immediately
    if (database_initialized) {
        console.log("Database is already initialized");
        return;
    }

    // If initialization has already started, return the promise for awaiting calls
    if (database_init_promise) {
        console.log("Database initialization already in progress, awaiting...");
        return database_init_promise;
    }

    // Start initialization and store the promise
    database_init_promise = (async () => {
        try {
            // Sync all models to the database (without dropping)
            /*
            await Cluster.sync({ alter: true });
            await Dlc.sync({ alter: true });
            await Asteroid.sync({ alter: true });
            await TotalGeyserOutput.sync({ alter: true });
            */
            console.log("Initializing database...")
            setAssociations()
            console.log("Set associations. Syncing...")
            //await sequelize.sync({force:true});
            await Cluster.sync({ force: true });
            console.log('----------------cluster created------------');
            await Dlc.sync({ force: true });
            console.log('----------------dlc created------------');
            await Asteroid.sync({ force: true });
            console.log('----------------asteroid created------------');
            await TotalGeyserOutput.sync({ force: true });
            console.log('----------------TotalGeyserOutput created------------');

            console.log('All tables created successfully!');
            database_initialized = true
        } catch (error) {
            console.error('Error creating tables: ', error);
            throw error;
        }
    })();
    
    await database_init_promise;
    database_init_promise = null;
}

/*
//let database_initialized = false
let database_started_init = false
const initializeDatabase = async () => {
    database_started_init = true
    //return if database is initialized
    if(database_initialized) {
        console.log("database initialized")
        return;
    }
    //if database is not initialized but is being initialized, wait
    while (database_started_init && !database_initialized) { 
        await setTimeout(()=>(console.log("checking again for init database")), 1000)
    }

    
};
*/


// INIT DATABASE
// VERY IMPORTANT
// SOURCE OF MANY A BUG
initializeDatabase()


// upload to SQL
router.post('/one', async (req, res) => {
    await initializeDatabase()
    try {
        //update schema in sql non-destructively 

        const jsonOld = req.body;
        await uploadSingleJson(jsonOld); //will be removed in favor of only bulk insert

        console.log("success uploading")
        return res.status(201).json({ response: "Upload successful!" });
    } catch (error) {
        console.log("error uploading")
        return res.status(500).json({ response: "Upload failed", error: error.message });
    }
});


router.post('/many', async (req, res) => {
    await initializeDatabase()
    try {
        let promises = []
        for (let jsonOld of req.body) {
            promises.push(uploadSingleJson(jsonOld))
        }
        await Promise.all(promises)

        console.log("success uploading")
        return res.status(201).json({ response: "Uploads successful!" });
    } catch (error) {
        console.log("error uploading")
        return res.status(500).json({ response: "Upload failed", error: error.message });
    }
});

router.post('/many/bulk', async (req, res) => {
    await initializeDatabase()

    const myq = new Queue(parseInt(process.env.SQL_MAX_CONNECT), 1); //wait 1ms between database requests

    let queue = []

    for (let i = 1; i <= req.body.length; i++) {
        let jsonOld = req.body[i - 1];
        queue.push(myq.run(() => uploadSingleJson(jsonOld, i).catch(err => console.error(err))))
    }
    await Promise.all(queue)
    console.log("-------------------------------Uploaded bulk------------------------------")
    return res.status(201).json({ response: "Uploads successful!" });
})


module.exports = router;