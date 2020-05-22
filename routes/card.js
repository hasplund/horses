const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Card = require('../model/card')

router.get('/', function (req, res, next) {
    Card
        .find()
        .exec(function (err, cards) {
            if (err) throw err;
            res.json(cards)
        });
})

router.get('/:cardId', function (req, res) {
    Card
        .findOne({cardId: req.param('cardId')})
        .exec(function (err, card) {
            if (err) throw err;
            res.json(card);
        })
});

router.get('/active', function (req, res, next) {
    Card
        .find()
        .exec(function (err, cards) {
            if (err) throw err;
            res.json(cards)
        });
})

router.post('/', function (req, res) {
    let cardId = req.body.cardId;
    console.log("CARDID: "+cardId)
    Card
        .findOneAndUpdate({cardId: req.body.cardId},
            {
                $set: {
                    country: req.body.country,
                    firstRaceStart: req.body.firstRaceStart,
                    meetDate: req.body.meetDate,
                    trackAbbreviation: req.body.trackAbbreviation,
                    trackName: req.body.trackName,
                    raceType: req.body.raceType,
                    done: req.body.done || false
                }
            },
            {
                new: true,
                upsert: true
            })
        .exec(function (err, card) {
            if (err) throw err;
            res.json(card)
        });
})

module.exports = router