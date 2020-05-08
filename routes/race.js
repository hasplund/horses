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

router.get('/card/:cardId', function (req, res) {
    Race
        .find({cardId: req['cardId']})
        .exec(function (err, races) {
            if (err) throw err;
            res.json(races)
        })
});

router.post('/', function (req, res) {
    let cardId = req.body.cardId;
    let raceId = req.body.raceId;
    Race
        .findOneAndUpdate({raceId: raceId},
            {
                $set: {
                    cardId: req.body.cardId,
                    raceId: req.body.raceId,
                    number: req.body.number,
                    startTime: req.body.startTime,
                    startType: req.body.startType,
                    distance: req.body.distance,
                    breed: req.body.breed,
                    toteResultString: req.body.toteResultString
                }
            },
            {new: true, upsert: true})
        .exec(function (err, race) {
            if (err) throw err;
            res.json(race)
        })
})

module.exports = router