const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    cardId: Number,
    country: String,
    firstRaceStart: Date,
    meetDate: Date,
    trackAbbreviation: String,
    trackName: String,
    raceType: String,
    active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Card', CardSchema)