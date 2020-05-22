const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OddsSchema = Schema({
    poolId: Number
});

module.exports = mongoose.model('Odds', OddsSchema)