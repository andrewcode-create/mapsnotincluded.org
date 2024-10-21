const express = require('express');
const router = express.Router();
const sequelize = require('../lib/database')
const {Cluster, Dlc, Asteroid, TotalGeyserOutput, setAssociations } = require('../models/index')


const uploadSingleJson = async (jsonOld) => {
    try {
        const newCluster = await Cluster.create({
            coordinate: jsonOld.coordinate,
            gameVersion: "0"  // TODO
        });

        await Dlc.create({
            coordinate: jsonOld.coordinate,
            vanilla: jsonOld["dlcs"].length === 0,
            spacedOut: jsonOld["dlcs"].includes("SpacedOut"),
            frostyPlanet: jsonOld["dlcs"].includes("FrostyPlanet"),
        });
        
        let gs = []
        for (let asteroidData of jsonOld.asteroids) {
            let nAst = await Asteroid.create({
                coordinate: newCluster.coordinate,
                name: asteroidData.id,
                worldTraits: asteroidData.worldTraits // THIS MIGHT CRASH if the enum doesn't have all the world traits
            });
            gs.push(
                await TotalGeyserOutput.create({
                    clusterId: null,
                    asteroidId: nAst.id,
                    //TODO add geysers. For now default to 0
                })
            )
        }
        
        await TotalGeyserOutput.create({
            clusterId: newCluster.coordinate,
            asteroidId: null,
            //TODO sum all geysers in gs and append. For now default to 0
        });
        
        console.log("------------------------------------------")
        console.log("------------------------------------------")
        console.log(`New Cluster uploaded: ${newCluster.coordinate}`)
        return newCluster; // Return newly created cluster or some status

    } catch (error) {
        console.error("Error while uploading data: ", error);
        throw error;
    }
};


const initializeDatabase = async () => {
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
    } catch (error) {
        console.error('Error creating tables: ', error);
        throw error;
    }
};

const uploadData = async (data) => {
    //const transaction = await sequelize.transaction(); // Start a transaction to rollback if anything fails
    try { 
        //TODO

        // Overview of function:
            // Bulk create Clusters
            // Prepare DLC 
            // Bulk create DLC
            // Prepare asteroids and totalGeyserOutput for the asteroid
            // Bulk create asteroids
            // Bulk create totalGeyserOutput for asteroids
            // Prepare totalGeyserOutput for Clusters
            // Bulk create totalGeyserOutput for Clusters
        

        // Bulk create Clusters
        console.log("creating clusters.");
        const clusters = data.map(seed => ({
            coordinate: seed.coordinate,
            gameVersion: "0" //TODO
        }))

        console.log(`\n\n\n\n\n\n Starting clusters, length ${clusters.length}:`)
        const createdClusters = await Cluster.bulkCreate(clusters, { /*transaction,*/ individualHooks: true, validate: true });

        // Prepare DLC
        console.log("creating dlc")
        const dlcs = data.map(seed => ({
            coordinate: seed.coordinate,
            vanilla: seed["dlcs"].length === 0,
            spacedOut: seed["dlcs"].includes("SpacedOut"),
            frostyPlanet: seed["dlcs"].includes("FrostyPlanet"),
        }))

        console.log(`\n\n\n\n\n\n Starting dlc, length ${dlcs.length}:`)
        // Bulk create DLC
        await Dlc.bulkCreate(dlcs, { /*transaction,*/ individualHooks: true, validate: true });

        // Prepare asteroids and totalGeyserOutput for the asteroid
        console.log("creating asteroids and their geyser outputs")
        const asteroids = [];
        const totalGeyserOutputs_asteroids = [];
        data.forEach((seed, index) => {
            seed["asteroids"].forEach((asteroid, index2) => {
                asteroids.push({
                    coordinate: seed.coordinate,
                    name: asteroid.id,
                    worldTraits: asteroid.worldTraits,
                });
                totalGeyserOutputs_asteroids.push({
                    clusterId: null,
                    asteroidId: null, // will be set after asteroids are created
                    // TODO add geyser, for now default to 0
                })
            })
        });

        console.log(`\n\n\n\n\n\n Starting Asteroids, length ${asteroids.length}:`)
        // Bulk Create asteroids
        const createdAsteroids = await Asteroid.bulkCreate(asteroids, { /*transaction,*/ individualHooks: true, validate: true });


        // Link asteroid Ids to TotalGeyserOutput
        console.log("linking asteroids to geysers")
        createdAsteroids.forEach((asteroid, index) => {
            // IDK if id is returned in createdAsteroids, possible bug
            // TODO
            totalGeyserOutputs_asteroids[index].asteroidId = asteroid.id;
        })

        console.log(`\n\n\n\n\n\n Starting Geysers_asteroids, length ${totalGeyserOutputs_asteroids.length}:`)
        // Bulk create totalGeyserOutput for asteroids
        await TotalGeyserOutput.bulkCreate(totalGeyserOutputs_asteroids, { /*transaction,*/ individualHooks: true, validate: true });

        console.log("creating geysers for clusters")
        // Prepare totalGeyserOutput for Clusters
        const totalGeyserOutputs_clusters = createdClusters.map(cluster => ({
            clusterId: cluster.coordinate,
            asteroidId: null,
            // TODO sum all geysers from asteroids in the cluster
            // for now default to 0
        }))

        console.log(`\n\n\n\n\n\n Starting Geysers_clusters, length ${totalGeyserOutputs_clusters.length}:`)

        // Bulk create totalGeyserOutput for clusters
        await TotalGeyserOutput.bulkCreate(totalGeyserOutputs_clusters, { /*transaction,*/ individualHooks: true, validate: true });

        console.log("\n\n Done geysers")
        // Commit the transaction if all operations succeed
        //await transaction.commit();
    } catch (error) {
        // Rollback transaction to preserve previous state
        //await transaction.rollback();

        console.error("Error while uploading data: ", error);
        throw error;
    }
}

// INIT DATABASE
// VERY IMPORTANT
// SOURCE OF MANY A BUG
initializeDatabase();


// upload to SQL
router.post('/one', async (req, res) => {
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
    try {        
        //TODO bulk insert
        for (let jsonOld of req.body) {
            const clusterNew = await uploadSingleJson(jsonOld);
            console.log(`uploaded ${clusterNew.coordinate}`)
        }

        console.log("success uploading")
        return res.status(201).json({ response: "Uploads successful!" });
    } catch (error) {
        console.log("error uploading")
        return res.status(500).json({ response: "Upload failed", error: error.message });
    }
});

router.post('/many/bulk', async (req, res) => {
    await uploadData(req.body)
    console.log("-------------------------------Uploaded bulk------------------------------")
    return res.status(201).json({ response: "Uploads successful!" });
})


module.exports = router;