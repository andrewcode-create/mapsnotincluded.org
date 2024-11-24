const express = require('express');
const sequelize = require('../lib/database');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const router = express.Router();
const {Cluster, Asteroid, TotalGeyserOutput, setAssociations } = require('../models/index')
const util = require('util');
const { performance } = require('perf_hooks');

// returns all data in database
router.get('/get_all', async (req, res) => {
    try {
        // not sure why associations need to be set everytime, but search fails without it
        setAssociations();
        
        const results = await Cluster.findAll({
            include: [
                {
                    model: Asteroid,
                    include: [
                        {
                            model: TotalGeyserOutput,
                            required: false,
                        }
                    ],
                    required: false,
                }, 
                {
                    model: TotalGeyserOutput,
                    required: false
                }
            ]
        });
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

/* Frontend search object sent in req.body:
"Search": {
    "cluster": clusterString,
    "dlcs": [],
    "rules": [
        [{rule1} OR {rule2}],
	AND
        [{rule3}],
    ]
}
*/
// given a search object, returns list of coordinates meeting search criteria
// only works for one set of OR rules 
router.get('/', async (req, res) => {
    try {
        // not sure why associations need to be set everytime, but search fails without it
        setAssociations();
        
        // parse search object
        const search = req.body.Search;
        const jsonRules = search.rules[0];
        let clusterWhereObj = clusterRuleTranslater(search);

        // handles joins
        let clusterIncludesObj = [];

        if (jsonRules.length > 0) {
            // works for world traits only right now
            let orRules = [];
            
            jsonRules.forEach(rule => {
                orRules.push(worldTraitRuleTranslater(rule))
            });

            // construct asteroid includes object
            let asteroidIncludesObj = {
                model: Asteroid,
                where: {[Op.or]: orRules} 
            };

            clusterIncludesObj.push(asteroidIncludesObj);
        }
        
        // prints objects and arrays too
        console.log(util.inspect(clusterIncludesObj, false, null, true /* enable colors */))

        const results = await Cluster.findAll({
            //attributes: ['coordinate'],
            where: clusterWhereObj,
            include: clusterIncludesObj
        });
        
        // create results array with unique coordinates 
        // (can't set to unique when using includes in sequelize query)
        let resultsArr = results.map((coordinate) => coordinate.coordinate);
        const resultsSet = [...resultsArr];

        console.log(resultsArr);
        return res.status(200).json(resultsSet);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

/* Search object for hardcoded tests:
Search: {
    "cluster": "V-SNDST-C",
    "dlcs": [
        "FrostyPlanet",
        "SpacedOut"
    ],
    "rules": [
        [
            {
                "asteroid": "MediumRadioactiveVanillaWarpPlanet",
                "geyserCount": null,
                "geyserOutput": null,
                "worldTrait": {
                    "has": true,
                    "worldTrait": "MagmaVents"
                },
                "spaceDestinationCount": null
            },
            {
                "asteroid": "TundraMoonlet",
                "geyserCount": null,
                "geyserOutput": null,
                "worldTrait": {
                    "has": true,
                    "worldTrait": "MetalPoor"
                },
                "spaceDestinationCount": null
            }
        ],
        [
            {
                "asteroid": null,
                "geyserCount": null,
                "geyserOutput": null,
                "worldTrait": {
                    "has": true,
                    "worldTrait": "FrozenCore"
                },
                "spaceDestinationCount": null
            }
        ]

    ]
}
*/

// hard coded search for testing time of search pattern
// uses sequelize and subquery --> can't get this to work
router.get('/seq', async (req, res) => {
    try {
        // not sure why associations need to be set everytime, but search fails without it
        setAssociations();
        
        /*
        get coordinates which have rows that have distress signal at the cluster level
            so 1: asteroid = null, worldTrait contains Distrss signal
        AND also have rows which 2: (A: has asteroid = medium... world Traits contains magmaVents
            OR B: has asteroid = tundra.. worldTraits contains metal poor)

        Can't use AND in WHERE clause to combine 1 and 2 as these are all different 
            asteroids therefore different rows so none will have a null and named asteroid
        
        Can't use GROUP BY coordinate, having COUNT >= 2 with all as OR in where: 
            possible to get coordinates with 2.A and 2.B but not 1
        
        Need to use nested subqueries to get under the WHERE clause
        */
        const search = {
            cluster: "V-SNDST-C",
            rules: [
                [
                    {
                        "asteroid": "MediumRadioactiveVanillaWarpPlanet",
                        "geyserCount": null,
                        "geyserOutput": null,
                        "worldTrait": {
                            "has": true,
                            "worldTrait": "MagmaVents"
                        },
                        "spaceDestinationCount": null
                    },
                    {
                        "asteroid": "TundraMoonlet",
                        "geyserCount": null,
                        "geyserOutput": null,
                        "worldTrait": {
                            "has": true,
                            "worldTrait": "MetalPoor"
                        },
                        "spaceDestinationCount": null
                    }
                ],
                [
                    {
                        "asteroid": null,
                        "geyserCount": null,
                        "geyserOutput": null,
                        "worldTrait": {
                            "has": true,
                            "worldTrait": "FrozenCore"
                        },
                        "spaceDestinationCount": null
                    }
                ]
            ]
        };

        let subquery = `Select "Cluster".coordinate from public."Cluster" 
	join public."Asteroid" on "Cluster".coordinate = "Asteroid".coordinate
	where ("Cluster".cluster = 'V-SNDST-C' and "Asteroid".name = null 
	and 'FrozenCore' = ANY("Asteroid"."worldTraits"))`

        const results = await Cluster.findAll({
            logging: console.log,
            attributes: ['coordinate'],
            where: {cluster: search.cluster},
            include: {
                model: Asteroid,
                where: {
                    [Op.and]: [{
                        coordinate: {[Op.in]: sequelize.literal(`(${subquery})`)},
                        [Op.or]: [
                            {name: "TundraMoonlet", worldTraits: {[Op.contains]: ["MetalPoor"]}},
                            {name: "MediumRadioactiveVanillaWarpPlanet", worldTraits: {[Op.contains]: ["MagmaVents"]}}
                        ]
                    }]
                }
            }
        });
        
        // create results array with unique coordinates 
        // (can't set to unique when using includes in sequelize query)
        let resultsArr = results.map((coordinate) => coordinate.coordinate);
        const resultsSet = [...resultsArr];

        console.log(resultsArr);
        return res.status(200).json(resultsSet);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

/*  hard coded search for testing time of search pattern
    uses sequelize with raw query, subqueries and IN
    RESULT: Raw SQL with subqueries took 648.5351669999982 milliseconds
*/
router.get('/seqRawSub', async (req, res) => {
    try {
        // not sure why associations need to be set everytime, but search fails without it
        setAssociations();

        //start timer
        const startTime = performance.now();

        const results = await sequelize.query(`
            SELECT "Cluster".coordinate FROM public."Cluster" 
	        JOIN public."Asteroid" ON "Cluster".coordinate = "Asteroid".coordinate
            WHERE (
                ("Cluster".cluster = 'V-SNDST-C' AND "Asteroid".name = 'MediumRadioactiveVanillaWarpPlanet' 
                    AND 'MagmaVents' = ANY("Asteroid"."worldTraits")) 
                OR
                ("Cluster".cluster = 'V-SNDST-C' AND "Asteroid".name = 'TundraMoonlet'
                    AND 'MetalPoor' = ANY("Asteroid"."worldTraits")
            )
            AND "Cluster".coordinate IN (
                SELECT "Cluster".coordinate FROM public."Cluster" 
                    JOIN public."Asteroid" ON "Cluster".coordinate = "Asteroid".coordinate
                    WHERE (
                        "Cluster".cluster = 'V-SNDST-C' AND "Asteroid".name = null 
                        AND 'FrozenCore' = ANY("Asteroid"."worldTraits")
                    )
            )
        )`, { type: QueryTypes.SELECT });
        
        // create results array with unique coordinates 
        let resultsArr = results.map((coordinate) => coordinate.coordinate);

        //end timer
        const endTime = performance.now();
        console.log(`Raw SQL with subqueries took ${endTime - startTime} milliseconds`)

        //console.log(resultsArr);
        return res.status(200).json(resultsArr);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

/*  hard coded search for testing time of search pattern
    uses sequelize with raw query, joins instead of subqueries
    RESULT: Raw SQL with subqueries took Raw SQL with joins took 3312.4270829999996 milliseconds
*/
router.get('/seqRawJoins', async (req, res) => {
    try {
        // not sure why associations need to be set everytime, but search fails without it
        setAssociations();

        //start timer
        const startTime = performance.now();

        const results = await sequelize.query(`
            SELECT DISTINCT c1.coordinate FROM public."Cluster" c1
            JOIN public."Cluster" c2 ON c1.coordinate = c2.coordinate
            JOIN public."Asteroid" a1 ON c1.coordinate = a1.coordinate
            JOIN public."Asteroid" a2 ON c2.coordinate = a2.coordinate
            WHERE (
            (c1.cluster = 'V-SNDST-C' AND a1.name = 'MediumRadioactiveVanillaWarpPlanet' 
                    AND 'MagmaVents' = ANY(a1."worldTraits")) 
                OR
                (c1.cluster = 'V-SNDST-C' AND a1.name = 'TundraMoonlet'
                    AND 'MetalPoor' = ANY(a1."worldTraits")
            )
            AND (
                c2.cluster = 'V-SNDST-C' AND a2.name = null 
                        AND 'FrozenCore' = ANY(a2."worldTraits"))
	    )`, { type: QueryTypes.SELECT });
        
        let resultsArr = results.map((coordinate) => coordinate.coordinate);

        //end timer
        const endTime = performance.now();
        console.log(`Raw SQL with joins took ${endTime - startTime} milliseconds`)

        //console.log(resultsArr);
        return res.status(200).json(resultsArr);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

/**
 * given a single json rule object RE world traits, translate rule to sequelize
 * @param {Object} rule The json rule object
 * @returns {Object} The json rule translated to sequlize object
 */
const worldTraitRuleTranslater = (rule) => {
        let wTRule = {[Op.contains]: [rule.worldTrait.worldTrait]};

        if (rule.worldTrait.has) {
            // include worldTraits
            return {name: rule.asteroid, worldTraits: wTRule};
        } else {
            // exclude world traits
            return {name: rule.asteroid, [Op.not]: {worldTraits: wTRule}};
        }; 
}

/**
 * Translate json search object into sequelize rules RE cluster
 * @param {object} search 
 * @returns object containing rules for where query in cluster model
 */
const clusterRuleTranslater = (search) => {
       // always look at cluster, this handles main cluster asteroid type and spacedOut vs vanilla dlc
       let clusterRules = {cluster: search.cluster};

       /* Exclude frostyPlanet seeds if not on DLC list; 
            FrostyPlanet: true means to include frosyPlanet seeds but don't limit to FrostyPlanet
            this handles mixed clusters which have frostyPlanet characteristics but are
            not on the ceres asteroid types
        */
       if (!search.dlcs.includes("FrostyPlanet")) {
           // restrict search
           clusterRules.frostyPlanet = false;
       };
       return clusterRules;
}

module.exports = router;