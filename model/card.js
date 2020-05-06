const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    cardId: Number,
    country: String,
    date: Date,
    firstRaceStart: Date,
    meetDate: Date,
    trackAbbreviation: String,
    trackName: String,
    raceType: String,
    done: { type: Boolean, default: false }
})

module.exports = mongoose.model('Card', CardSchema)