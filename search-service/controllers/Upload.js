const express = require('express');
const router = express.Router();
const {Cluster, Dlc, Asteroid, TotalGeyserOutput} = require('../models/index')

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
                coordinate: jsonOld.coordinate,
                name: asteroidData.id,
                worldTraits: asteroidData.worldTraits
            });
            gs.append(
                await TotalGeyserOutput.create({
                    clusterId: null,
                    asteroidId: nAst.id,
                    //TODO add geysers. For now default to 0
                })
            )
        }

        await TotalGeyserOutput.create({
            
            clusterId: jsonOld.coordinate,
            asteroidId: null,
            //TODO sum all geysers in gs and append. For now default to 0
        });
        

        return newCluster; // Return newly created cluster or some status

    } catch (error) {
        console.error("Error while uploading data: ", error);
        throw error;  // or handle the error more gracefully if needed
    }
};


// upload to SQL
router.post('/', async (req, res) => {
    try {
        const jsonOld = req.body;
        await uploadSingleJson(jsonOld); // TODO go one part at a time in the array

        return res.status(201).json({ response: "Upload successful!" });
    } catch (error) {
        return res.status(500).json({ response: "Upload failed", error: error.message });
    }
});

module.exports = router;