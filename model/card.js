const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    cardId: String,
    country: String,
    date: Date,
    firstRaceStart: Date,
    meetDate: Date,
    trackAbbreviation: String,
    trackName: String,
    raceType: String
})

module.exports = mongoose.model('Card', CardSchema)