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

agenda.define('load cards', async job => {
    console.log('load cards')
    await axios({
        method: "get",
        url: 'https://www.veikkaus.fi//api/toto-info/v1/cards/today',
        responseType: 'json'
    })
        .then(function (response) {
            let collection = response['data']['collection'];
            for (let item in collection) {
                let card = prepareSendCard(collection[item])
                Card
                    .findOneAndUpdate({cardId: card['cardId']},
                        {$set: card},
                        {new: true, upsert: true})
                    .exec(function (err, card) {
                        if (err) throw err;

                    })
            }
        });
});

function prepareSendRace(cardData) {
    let sendVariables = {cardId: cardData['cardId']};
    sendVariables['raceId'] = cardData['raceId']
    sendVariables['number'] = cardData['number']
    sendVariables['raceStatus'] = cardData['raceStatus']
    sendVariables['startTime'] = cardData['startTime']
    sendVariables['startType'] = cardData['startType']
    sendVariables['distance'] = cardData['distance']
    sendVariables['breed'] = cardData['breed']
    sendVariables['toteResultString'] = cardData['toteResultString']
    return sendVariables
}

agenda.define('load races', async job => {
    console.log('load races')
    Card
        .find()
        .exec(function (err, cards) {
            let counter = 0;
            if (err) throw err;
            for (let card in cards) {
                axios({
                    method: 'get',
                    url: 'https://www.veikkaus.fi//api/toto-info/v1/card/' + cards[card]['cardId'] + '/races',
                    responseType: 'json'
                })
                    .then(function (response) {
                        for (let cardId in response['data']['collection']) {
                            let raceData = response['data']['collection'][cardId];
                            let raceJSON = prepareSendRace(raceData);
                            Race
                                .findOneAndUpdate({cardId: raceData['cardId']},
                                    {$set: raceJSON},
                                    {new: true, upsert: true})
                                .exec(function (result) {
                                    if (err) throw err;
                                });
                        }
                    })
            }
        })
});

function prepareSendPool(poolData) {
    let sendVariables = {cardId: poolData['cardId']}
    sendVariables['firstRaceId'] = poolData['firstRaceId']
    sendVariables['poolType'] = poolData['poolType']
    sendVariables['poolName'] = poolData['poolName']
    sendVariables['poolStatus'] = poolData['poolStartus']
    sendVariables['netSales'] = poolData['netSales']
    sendVariables['netPool'] = poolData['netPool']
    return sendVariables;
}

agenda.define('load pools', async job => {
    console.log('load pools')
    Card
        .find({})
        .exec(function (err, cards) {
            for (let card in cards) {
                axios({
                    method: 'get',
                    url: 'https://www.veikkaus.fi//api/toto-info/v1/card/' + cards[card]['cardId'] + '/pools'
                })
                    .then(function (response) {
                        for (let cardId in response['data']['collection']) {
                            let poolData = response['data']['collection'][cardId];
                            let poolJSON = prepareSendPool(poolData);
                            Pool
                                .findOneAndUpdate({cardId: poolData['cardId']},
                                    {$set: poolJSON},
                                    {new: true, upsert: true})
                                .exec(function (result) {
                                    if (err) throw err;
                                });
                        }
                    })
            }
        });
});


/* Start agenda */
(async function () { // IIFE to give access to async/await
    await agenda.start();
    await agenda.purge();
    await agenda.every('10 minutes', 'load cards')
    await agenda.every('10 minutes', 'load races')
    await agenda.every('2 minutes', 'load pools')
})();

/* Graceful exit */
function graceful() {
    agenda.stop(function () {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);