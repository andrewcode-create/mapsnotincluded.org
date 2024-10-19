const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

router.get('/', (req, res) => {
    return res.json({
        response: "this is where search will go"
    });
});


module.exports = router;