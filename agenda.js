const dburl = 'mongodb://localhost:27017/horses';
const url = process.env.MONGOLAB_URI;
const Agenda = require('agenda');
const mongoose = require('mongoose');
const Card = require('./model/card');
const axios = require('axios')

/*
Define agenda
 */
const agenda = new Agenda({
    db: {address: url || dburl, collection: 'agendaJobs'},
    processEvery: '5 seconds'
});

/*
 Define card loader
 */

agenda.define('load cards', async job => {
    console.log('load cards')
    await axios({
        method: "get",
        url: 'https://www.veikkaus.fi//api/toto-info/v1/cards/today',
        responseType: 'json'
    })
        .then(function (response) {
            for (let item in response['data']['collection']) {
                let dataItem = response['data']['collection'][item];
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
                });
            }
        });
});
/*
Define race loader
 */
agenda.define('load races', async job => {
    console.log('load races');
    axios({
        method: 'get',
        url: 'http://localhost:3000/cards',
        responseType: 'json'
    }) // Get cards
        .then(function (response) {
                for (let item in response['data']) {

                    axios({ // get races by card id
                        method: 'get',
                        url: 'https://www.veikkaus.fi//api/toto-info/v1/card/' + response['data'][item]['cardId'] + "/races",
                        responseType: 'json'
                    }).then(function (response) {
                        for (let i in response['data']['collection']) {
                            // console.log(response['data']['collection'])
                            let dItem = response['data']['collection'][i];
                            axios({ // Post races
                                method: 'post',
                                url: 'http://localhost:3000/races',
                                responseType: 'json',
                                data: {
                                    raceId: dItem['raceId'],
                                    cardId: dItem['cardId'],
                                    number: dItem['number'],
                                    startTime: dItem['startTime'],
                                    startType: dItem['startType'],
                                    distance: dItem['distance'],
                                    breed: dItem['breed'],
                                    toteResultString: dItem['toteResultString']
                                }
                            })
                        }
                    });
                }
            }
        )
});

/* Start agenda */
(async function () { // IIFE to give access to async/await
    await agenda.start();
    await agenda.purge();
    await agenda.every('10 minutes', 'load cards')
    await agenda.every('10 minutes', 'load races')
})();

/* Graceful exit */
function graceful() {
    agenda.stop(function () {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);