/**
 *
 * This file handles the asynchronous downloading of Cards, Races and Pools
 */

const dburl = 'mongodb://localhost:27017/horses';
const url = process.env.MONGOLAB_URI;
const Agenda = require('agenda');
const mongoose = require('mongoose');
const Card = require('./model/card');
const Race = require('./model/race')
const Pool = require('./model/pool')
const axios = require('axios');

/*
Define agenda
 */
const agenda = new Agenda({
    db: {address: url || dburl, collection: 'agendaJobs'},
    processEvery: '5 seconds'
});

/**
 * Transform card to be set in the load cards task
 * @param cardData
 * @returns JSON card
 */
function prepareSendCard(cardData) {
    let sendVariables = {cardId: cardData['cardId']};
    sendVariables['firstRaceStart'] = cardData['firstRaceStart'];
    sendVariables['country'] = cardData['country'];
    sendVariables['meetDate'] = cardData['meetDate']
    sendVariables['trackAbbreviation'] = cardData['trackAbbreviation'];
    sendVariables['trackName'] = cardData['trackName'];
    sendVariables['raceType'] = cardData['raceType'];
    return sendVariables;
}

/**
 * Load the cards from Veikkaus and set the card properties accordingly
 */
agenda.define('load cards', async job => {
    console.log("load cards");
    axios({
        method: 'get',
        url: 'https://www.veikkaus.fi//api/toto-info/v1/cards/active',
        responseType: 'json'
    })
        .then(function (response) {
            let coll = response['data']['collection']
            for (let card in coll) {
                let cardData = coll[card];
                let cardTransform = prepareSendCard(cardData);
                if(cardTransform['country']==="FI") {
                    Card
                        .findOneAndUpdate({cardId: cardTransform['cardId']},
                            {$set: cardTransform},
                            {new: true, upsert: true, useFindAndModify: true})
                        .exec(function (err, card) {
                            if (err) throw err;
                        })
                }
            }
        });
});

/**
 * Transform card to be set in the load cards task
 *
 * @param raceData
 * @returns JSON Race
 */
function prepareSendRace(raceData) {
    let sendVariables = {cardId: raceData['cardId']};
    sendVariables['raceId'] = raceData['raceId']
    sendVariables['number'] = raceData['number']
    sendVariables['raceStatus'] = raceData['raceStatus']
    sendVariables['startTime'] = raceData['startTime']
    sendVariables['startType'] = raceData['startType']
    sendVariables['distance'] = raceData['distance']
    sendVariables['breed'] = raceData['breed']
    sendVariables['toteResultString'] = raceData['toteResultString']
    return sendVariables
}

/**
 * Load races from Veikkaus servers amd set the JSON data accordingly
 */
agenda.define('load races', async job => {
    console.log('load races')
    Card
        .find({active: true})
        .exec(function (err, cards) {
            if (err) throw err;
            for (let card in cards) {
                let cardId = (cards[card]['cardId']);
                axios({
                    method: 'get',
                    url: 'https://www.veikkaus.fi//api/toto-info/v1/card/' + cardId + '/races',
                    responseType: 'json'
                })
                    .then(function (response) {
                        let coll = response['data']['collection'];
                        for (let raceNumber in coll) {
                            let race = coll[raceNumber];
                            let raceTransform = prepareSendRace(race);
                            Race
                                .findOneAndUpdate({raceId: raceTransform['raceId']},
                                    {$set: raceTransform},
                                    {new: true, upsert: true})
                                .exec(function (err, race) {
                                    if (err) throw err;
                                })
                        }
                    })
            }
        })
});

/**
 * Transform pools to JSON
 * @param poolData
 * @returns {{cardId: *}}
 */
function prepareSendPool(poolData) {
    let sendVariables = {cardId: poolData['cardId']}
    sendVariables['poolId'] = poolData['poolId']
    sendVariables['firstRaceId'] = poolData['firstRaceId']
    sendVariables['poolType'] = poolData['poolType']
    sendVariables['poolName'] = poolData['poolName']
    sendVariables['poolStatus'] = poolData['poolStatus']
    sendVariables['netSales'] = poolData['netSales']
    sendVariables['netPool'] = poolData['netPool']
    return sendVariables;
}

/** Set or create Pools
 *
 */
agenda.define('load pools', async job => {
    console.log('load pools')
    Card
        .find({active: true})
        .exec(function (err, cards) {
            if (err) throw err;
            for (let card in cards) {
                let cardId = cards[card]['cardId']
                axios({
                    method: 'get',
                    url: 'https://www.veikkaus.fi//api/toto-info/v1/card/' + cardId + '/pools',
                    responseType: 'json'
                })
                    .then(function (response) {
                        let coll = response['data']['collection'];
                        for (let poolNumber in coll) {
                            let pool = coll[poolNumber]
                            let poolTransform = prepareSendPool(pool);
                            let poolType = poolTransform['poolType']

                            if (poolType === "VOI" || poolType === "SIJ" || poolType === "TRO" || poolType === "KAK") {
                                Pool
                                    .findOneAndUpdate({poolId: poolTransform['poolId']},
                                        {$set: poolTransform},
                                        {new: true, upsert: true, useFindAndModify: false})
                                    .exec(function (err, pItem) {
                                        if (err) throw err;
                                    })

                            }


                        }
                    });
            }
        });
});

/** Close cards when all Races are "OFFICIAL", i.e. all races are completed
 *
 */
agenda.define('close cards', async job => {
    console.log('close cards')
    Card
        .find({})
        .exec(function (err, cards) {
            if (err) throw err;
            for (let card in cards) {
                Race.find({cardId: cards[card]['cardId']})
                    .exec(function (err, races) {
                        if (err) throw err;
                        let official = true;
                        for (let race in races) {
                            official = official && (races[race]['raceStatus'] === "OFFICIAL")
                            if (!official)
                                break;
                        }

                        Card
                            .findOneAndUpdate({cardId: cards[card]['cardId']},
                                {
                                    $set: {
                                        active: !official
                                    }
                                },
                                {new: true})
                            .exec(function (err2, c2) {
                                if (err2) throw err2;
                            })
                    })
            }
        })
});


/* Start agenda */
(async function () { // IIFE to give access to async/await
    await agenda.start();
    await agenda.every('10 minutes', 'load cards')
    await agenda.every('10 minutes', 'load races')
    await agenda.every('2 minutes', 'load pools')
    await agenda.every('10 minutes', 'close cards')
})();

/* Graceful exit */
function graceful() {
    agenda.stop(function () {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);