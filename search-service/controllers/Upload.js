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

initializeDatabase();


// upload to SQL
router.post('/one', async (req, res) => {
    try {
        //update schema in sql non-destructively 

        const jsonOld = req.body;
        await uploadSingleJson(jsonOld); // TODO go one part at a time in the array

        console.log("success uploading")
        return res.status(201).json({ response: "Upload successful!" });
    } catch (error) {
        console.log("error uploading")
        return res.status(500).json({ response: "Upload failed", error: error.message });
    }
});

router.post('/many', async (req, res) => {
    try {
        //update schema in sql non-destructively 

        
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


module.exports = router;