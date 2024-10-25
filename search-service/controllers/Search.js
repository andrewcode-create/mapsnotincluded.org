const express = require('express');
const router = express.Router();
const sequelize = require('../lib/database')
const {Cluster, Dlc, Asteroid, TotalGeyserOutput, setAssociations } = require('../models/index')

router.get('/get_all', async (req, res) => {

    try {
        const results = await Cluster.findAll({
            include: [
                /*
                {
                    model: Dlc,
                    required: false, // Optional join (includes clusters with no DLC)
                },
                */
                {
                    model: Asteroid,
                    include: [
                        {
                            model: TotalGeyserOutput,
                            required: false, // Optional join (includes asteroids with no geyser output)
                        }
                    ],
                    required: false, // Optional join (includes clusters with no asteroids)
                }, 
                {
                    model: TotalGeyserOutput,
                    required: false
                }
            ]
        });
        //console.log(results);
        return res.status(200).json(results);
    } catch {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});


router.get('/', (req, res) => {
    return res.json({
        response: "this is where search will go"
    });
});


module.exports = router;