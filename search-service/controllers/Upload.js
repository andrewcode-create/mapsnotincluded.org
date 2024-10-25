const express = require('express');
const router = express.Router();
const sequelize = require('../lib/database')
const {Cluster, Dlc, Asteroid, TotalGeyserOutput, setAssociations } = require('../models/index')
const { Queue } = require('async-await-queue');

const uploadSingleJson = async (jsonOld) => {
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

        /*
        let gs = []
        for (let asteroidData of jsonOld.asteroids) {
            let nAst = await Asteroid.create({
                coordinate: newCluster.coordinate,
                name: asteroidData.id,
                worldTraits: asteroidData.worldTraits // THIS MIGHT CRASH if the enum doesn't have all the world traits
            }, {
                transaction:transaction
            });
            gs.push(
                await TotalGeyserOutput.create({
                    clusterId: null,
                    asteroidId: nAst.id,
                    //TODO add geysers. For now default to 0
                }, {transaction:transaction})
            )
        }
            */
        
        await TotalGeyserOutput.create({
            clusterId: newCluster.coordinate,
            asteroidId: null,
            //TODO sum all geysers in gs and append. For now default to 0
        }, {
            transaction:transaction
        });
        
        //console.log("------------------------------------------")
        //console.log("------------------------------------------")
        transaction.commit();
        console.log(`New Cluster uploaded: ${newCluster.coordinate}`)
        return newCluster; // Return newly created cluster or some status

    } catch (error) {
        console.error("Error while uploading data: ", error);
        transaction.rollback()
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

/*
const uploadData = async (data) => {
    //const transaction = await sequelize.transaction(); // Start a transaction to rollback if anything fails
    

    const transactionCluster = await sequelize.transaction();
    const transactionAsteroid = await sequelize.transaction();
    const transactionTotalGeyser = await sequelize.transaction();
    const transactionDlc = await sequelize.transaction();

    try { 
        //TODO

        // Overview of function:
            // / Bulk create Clusters
            // | Prepare DLC 
            // \ Bulk create DLC
            //   Prepare asteroids and totalGeyserOutput for the asteroid
            //   Bulk create asteroids
            // Bulk create totalGeyserOutput for asteroids
            // Prepare totalGeyserOutput for Clusters
            // Bulk create totalGeyserOutput for Clusters
        
        // Bulk create Clusters
        prepare_Clusters = async (data) => {
            console.log("creating clusters.");
            const clusters = data.map(seed => ({
                coordinate: seed.coordinate,
                gameVersion: "0" //TODO
            }))
            console.log("clusters created")
            return clusters;
        }

        create_Clusters = async (clusters, transaction) => {
            console.log(`Starting clusters, length ${clusters.length}:`)
            const createdClusters = await Cluster.bulkCreate(clusters, { transaction, individualHooks: true, validate: true });
            console.log("finished clusters")
            return createdClusters;
        }

        // Prepare DLC
        prepare_Dlc = async (data) => { 
            console.log("creating dlc")
            const dlcs = data.map(seed => ({
                coordinate: seed.coordinate,
                vanilla: seed["dlcs"].length === 0,
                spacedOut: seed["dlcs"].includes("SpacedOut"),
                frostyPlanet: seed["dlcs"].includes("FrostyPlanet"),
            }))
            console.log("dlc created")
            return dlcs;
        }

        create_Dlc = async (dlcs, transaction) => {
            console.log(`Starting dlc, length ${dlcs.length}:`)
            // Bulk create DLC
            await Dlc.bulkCreate(dlcs, { transaction, individualHooks: true, validate: true });
            console.log("finished dlc")
        }

        

        // Prepare asteroids and totalGeyserOutput for the asteroid
        const prepareAsteroidsAndGeyser = async (data) => {
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
            console.log("finished creating asteroids and geyser outputs")
            return [asteroids, totalGeyserOutputs_asteroids]
        }

        // Bulk Create asteroids
        const create_asteroids = async (asteroids, transaction) => {
            console.log(`Starting Asteroids, length ${asteroids.length}:`)
            const createdAsteroids = await Asteroid.bulkCreate(asteroids, { transaction, individualHooks: true, validate: true });
            console.log("finished asteroids")
            return createdAsteroids
        }

        

        // Bulk create totalGeyserOutput for asteroids
        const create_totalGeyserOutputs_asteroids = async (totalGeyserOutputs_asteroids, transaction) => {
            console.log(`Starting Geysers_asteroids, length ${totalGeyserOutputs_asteroids.length}:`)
            await TotalGeyserOutput.bulkCreate(totalGeyserOutputs_asteroids, { transaction, individualHooks: true, validate: true });
            console.log("finsihed totalGeyserOutputs_asteroids") 
        }

        // Prepare totalGeyserOutput for Clusters
        const prepare_geyserCluster = async (createdClusters) => {
            console.log("creating geysers for clusters")
            const totalGeyserOutputs_clusters = createdClusters.map(cluster => ({
                clusterId: cluster.coordinate,
                asteroidId: null,
                // TODO sum all geysers from asteroids in the cluster
                // for now default to 0
            }))
            console.log("finished creating geyser_cluster")
            return totalGeyserOutputs_clusters;
        }

        // Bulk create totalGeyserOutput for clusters
        const create_totalGeyserOutputs_clusters = async (totalGeyserOutputs_clusters, transaction) => {
            console.log(`Starting Geysers_clusters, length ${totalGeyserOutputs_clusters.length}:`)
            await TotalGeyserOutput.bulkCreate(totalGeyserOutputs_clusters, { transaction, individualHooks: true, validate: true });
            console.log("finished geysers")
        }




        const clusters = await prepare_Clusters(data);
        const dlcs = await prepare_Dlc(data);
        const createdClusters = await create_Clusters(clusters, transactionCluster)
        await transactionCluster.commit(); //do this here for concurency. TODO delete these rows if failure
        //const [createdClusters, createdDlcs] = await Promise.all([, create_Dlc(dlcs, transactionDlc)])
        //const createdDlcs = await create_Dlc(dlcs, transactionDlc)
        const [asteroids, totalGeyserOutputs_asteroids] = await prepareAsteroidsAndGeyser(data)
        const createdAsteroids = await create_asteroids(asteroids, transactionAsteroid)
        // Link asteroid Ids to TotalGeyserOutput
        console.log("linking asteroids to geysers")
        createdAsteroids.forEach((asteroid, index) => {
            totalGeyserOutputs_asteroids[index].asteroidId = asteroid.id;
        })
        await transactionAsteroid.commit(); //do this here for concurency. TODO delete these rows if failure
        //await create_totalGeyserOutputs_asteroids(totalGeyserOutputs_asteroids, transactionTotalGeyser)
        const totalGeyserOutputs_clusters = await prepare_geyserCluster(createdClusters)
        //await create_totalGeyserOutputs_clusters(totalGeyserOutputs_clusters, transactionTotalGeyser)

        Promise.all([
            create_totalGeyserOutputs_asteroids(totalGeyserOutputs_asteroids, transactionTotalGeyser), 
            create_totalGeyserOutputs_clusters(totalGeyserOutputs_clusters, transactionTotalGeyser), 
            create_Dlc(dlcs, transactionDlc)
        ]);


        // Commit the transaction if all operations succeed
        console.log("commiting!")
        //await transaction.commit();

        
        await transactionTotalGeyser.commit();
        await transactionDlc.commit();
    } catch (error) {
        // Rollback transaction to preserve previous state
        //await transaction.rollback();
        //await transactionCluster.rollback();
        //await transactionAsteroid.rollback();
        await transactionTotalGeyser.rollback();
        await transactionDlc.rollback();

        console.error("Error while uploading data: ", error);
        throw error;
    }
}
    */

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
        /*
        for (let jsonOld of req.body) {
            const clusterNew = await uploadSingleJson(jsonOld);
            console.log(`uploaded ${clusterNew.coordinate}`)
        }
        */

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

    const myq = new Queue(parseInt(process.env.SQL_MAX_CONNECT), 1);

    //await uploadData(req.body)
    let queue = []
    for (let jsonOld of req.body) {
        queue.push(myq.run(uploadSingleJson(jsonOld).catch(err => console.error(err))))
    }
    await Promise.all(queue)
    console.log("-------------------------------Uploaded bulk------------------------------")
    return res.status(201).json({ response: "Uploads successful!" });
})


module.exports = router;