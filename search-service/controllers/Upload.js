const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    return res.statusCode(501).json({response: "Upload failed because it isn't implemented yet."})
});

module.exports = router;