const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RaceSchema = new Schema({
    cardId: String,
    raceId: String,
    number: Number,
    raceStatus: String,
    startTime: Date
})

module.exports = mongoose.model('Race', RaceSchema)