const dburl = 'mongodb://localhost:27017/horses';
const url = process.env.MONGOLAB_URI;
const Agenda = require('agenda');
const mongoose = require('mongoose');
const Card = require('./model/card');
const axios = require('axios')

const agenda = new Agenda({
    db: {address: url || dburl, collection: 'agendaJobs'},
    processEvery: '5 seconds'
});

/*agenda.define('load cards', async job => {
    console.log("Load cards")
})*/

agenda.define('load cards', async job => {
    console.log('load cards')
    await axios({
        method: "get",
        url: 'https://www.veikkaus.fi//api/toto-info/v1/cards/active',
        responseType: 'json'
    })
        .then(function (response) {
            for (let item in response['data']['collection']) {
                let dataItem = response['data']['collection'][item]
                console.log(dataItem);
                axios({
                    method: 'post',
                    url: 'http://localhost:3000/cards',
                    data: {
                        cardId: dataItem['cardId'],
                        country: dataItem['country'],
                        firstRaceStart: dataItem['firstRaceStart'],
                        meetDate: dataItem['meetDate'],
                        trackAbbreviation: dataItem['trackAbbreviation'],
                        trackName: dataItem['trackName'],
                        raceType: dataItem['raceType']
                    }
                })
            }
        })
});

(async function () { // IIFE to give access to async/await
    await agenda.start();
    await agenda.now('load cards');
    await agenda.every('10 minutes', 'load cards');
})();

function graceful() {
    agenda.stop(function () {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);