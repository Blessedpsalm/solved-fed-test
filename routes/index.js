const express = require('express');
const router = express.Router();

// Handle get and post requests here

module.exports = router;


router.get('/', function(req, res){
    res.render('../views/index.njk');
 })