const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Race = require('../model/race')

router.get('/', function (req, res) {
    Race
        .find()
        .exec(function (err, races) {
           if (err) throw err;
           if (races) res.json(races);
        });
})



module.exports = router