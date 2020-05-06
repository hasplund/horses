const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RaceSchema = new Schema({
    cardId: Number,
    raceId: Number,
    number: Number,
    raceStatus: String,
    startTime: Date,
    startType: String,
    distance: Number,
    breed: String,
    toteResultString: { type: String, default: ""}
})

module.exports = mongoose.model('Race', RaceSchema)