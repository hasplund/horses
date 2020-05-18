const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoolSchema = new Schema({
    cardId: Number,
    poolId: Number,
    firstRaceId: Number,
    poolType: String,
    poolName: String,
    poolStatus: String,
    netSales: Number,
    netPool: Number
})

module.exports = mongoose.model('Pool', PoolSchema)