const express = require('express');
const router = express.Router();
const sequelize = require('../lib/database')
const { Cluster, Dlc, Asteroid, TotalGeyserOutput, setAssociations } = require('../models/index')
const { Queue } = require('async-await-queue');
const fs = require('fs');

const uploadSingleJson = async (jsonOld, numtoPrint = 0, printClusters = true) => {
    const transaction = await sequelize.transaction();
    try {
        // set dlc based on coordinate info
        let coor = jsonOld.coordinate;
        let spacedOut = false;
        let vanilla = true;
        let frostyPlanet = false;

        const coorArr = coor.split("-");

        // set spacedOut dlc
        if (coorArr[1] === "C" || coorArr[2] === "C") {
            spacedOut = true;
        };

        // set frostyPlanet dlc
        if (coorArr[0].includes("CER") ||
            coorArr[1].includes("CER") ||
            coorArr[coorArr.length-1] !== "0" // indicates mixing
        ) {
            frostyPlanet = true;
        };
        
        if (spacedOut === true || frostyPlanet === true) {
            vanilla = false;
        };

        const newCluster = await Cluster.create({
            coordinate: jsonOld.coordinate,
            cluster: jsonOld.cluster,
            gameVersion: parseInt(jsonOld["gameVersion"]),
            vanilla: vanilla,
            spacedOut: spacedOut,
            frostyPlanet: frostyPlanet,
        }, {
            transaction:transaction
        });

        const asteroidBulkData = jsonOld.asteroids.map(asteroidData => ({
            coordinate: newCluster.coordinate,
            name: asteroidData.id,
            worldTraits: asteroidData.worldTraits
        }));

        const createdAsteroids = await Asteroid.bulkCreate(asteroidBulkData, { transaction:transaction , individualHooks: true, validate:true, hooks:true});
       
        const totalGeyserOutputBulkData = createdAsteroids.map(asteroid => ({
            clusterId: null,
            asteroidId: asteroid.id, // link it to the asteroid
        }));

        let i = 0;
        let geyser_keys = [];
        let newClusterTraits = [];
        jsonOld.asteroids.forEach(asteroid => {
            // add worldTrait to clusterTraits
            newClusterTraits.push(...asteroid.worldTraits);

            // add geysers
            asteroid["geysers"].forEach(geyser => {
                if (totalGeyserOutputBulkData[i][`${geyser.id}_Count`]) {
                    //already had one
                    totalGeyserOutputBulkData[i][`${geyser.id}_Count`]++;
                    totalGeyserOutputBulkData[i][`${geyser.id}_TotalOutput`] += geyser["avgEmitRate"]
                } else {
                    //new geyser
                    geyser_keys.push(geyser.id)
                    totalGeyserOutputBulkData[i][`${geyser.id}_Count`] = 1
                    totalGeyserOutputBulkData[i][`${geyser.id}_TotalOutput`] = geyser["avgEmitRate"]
                }
            })
            i++
        });

        // remove duplicates from newClusterTraits
        newClusterTraits = [...new Set(newClusterTraits)];

        // for easier searching of worldTraits over cluster
        await Asteroid.create({
            coordinate: newCluster.coordinate,
            name: null,
            worldTraits: newClusterTraits
        }, {
            transaction:transaction
        });

        gs = await TotalGeyserOutput.bulkCreate(totalGeyserOutputBulkData, { transaction:transaction , individualHooks: true, validate:true, hooks:true});

        const clusterGeyserOutput = gs.reduce(((total, current) => {
            for(key in geyser_keys) {
                key = geyser_keys[key]
                if (total[`${key}_Count`]) {
                    total[`${key}_Count`] += current[`${key}_Count`];
                    total[`${key}_TotalOutput`] += current[`${key}_TotalOutput`];
                } else {
                    total[`${key}_Count`] = current[`${key}_Count`];
                    total[`${key}_TotalOutput`] = current[`${key}_TotalOutput`];
                }
            }
            return total;
        }), {});

        clusterGeyserOutput.clusterId = newCluster.coordinate;
        clusterGeyserOutput.asteroidId = null;

        await TotalGeyserOutput.create(clusterGeyserOutput, {transaction:transaction});
        
        transaction.commit();
        if (printClusters) console.log(`${numtoPrint}: New Cluster uploaded: ${newCluster.coordinate}`)
        return newCluster; // Return newly created cluster or some status

    } catch (error) {
        console.error("Error while uploading data: ", error);
        transaction.rollback()
        throw error;
    }
};

const uploadBulk = async(jsonArrOld, printClusters = true) =>  {
    await initializeDatabase()

    const myq = new Queue(parseInt(process.env.SQL_MAX_CONNECT), 1); //wait 1ms between database requests

    let queue = []

    for (let i = 1; i <= jsonArrOld.length; i++) {
        let jsonOld = jsonArrOld[i - 1];
        queue.push(myq.run(() => uploadSingleJson(jsonOld, i, printClusters).catch(err => console.error(err))))
    }
    await Promise.all(queue)
}

let database_initialized = false;
let database_init_promise = null;

/* sync force true (line 166) overrides and drops current database
 according to docs, sync should not be used in production
 do we need to initialize the database everytime? How/when is upload being used?
 */
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

            // sync force true overrides and drops current database
            // according to docs, sync should not be used in production
            console.log("Initializing database...")
            console.log("Syncing...")
            //await sequelize.sync({force:true});
            await Cluster.sync({ force: true });
            console.log('----------------cluster created------------');
            //await Dlc.sync({ force: true });
            //console.log('----------------dlc created------------');
            await Asteroid.sync({ force: true });
            console.log('----------------asteroid created------------');
            await TotalGeyserOutput.sync({ force: true });
            console.log('----------------TotalGeyserOutput created------------');
            console.log('All tables created successfully!');
            setAssociations();
            console.log("Set associations.")

            database_initialized = true
        } catch (error) {
            console.error('Error creating tables: ', error);
            throw error;
        }
    })();
    
    await database_init_promise;
    database_init_promise = null;
}


//run init when server starts to increase response speed
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

/*
router.post('/many/old', async (req, res) => {
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
*/

router.post('/bulk', async (req, res) => {
    await uploadBulk(req.body)
    console.log("-------------------------------Uploaded bulk------------------------------")
    return res.status(201).json({ response: "Uploads successful!" });
})


router.post('/refreshSQL', async (req, res) => {

    const inputFilePath = "./utils/worlds.json";


    let jsonArray = null;

    try {
        const data = await fs.promises.readFile(inputFilePath, 'utf8')
        jsonArray = JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error('Error reading the input file:', err);
            return res.status(500).json({response: "Error reading input file"});
        } else if (err instanceof SyntaxError) {
            console.error('Error parsing JSON data:', err);
            return res.status(500).json({response: "Error parsing input file"});
        } else {
            console.error('Unexpected error:', err);
            return res.status(500).json({response: "Unexpected error with file"});
        }
    }
    
    if (jsonArray === null) {
        console.log("RefreshSQL error. The file is not loaded correctly.")
        return res.status(500).json({ response: "File data is empty or null" });
    }

    //console.log(jsonArray)
    console.log("-------------------------------Starting SQL Refresh------------------------------")
    console.log(`There are ${jsonArray.length} seeds in the database about to be uploaded.`)
    await uploadBulk(jsonArray, false)
    console.log("-------------------------------Refreshed SQL------------------------------")
    return res.status(201).json({ response: "Refresh successful!" });
})


module.exports = router;