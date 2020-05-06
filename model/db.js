/**
 * Set up the mongoose module
 * @type {*|Mongoose}
 */
var mongoose = require('mongoose');

/**
 * URI form the MongoDB database
 * Use an environment value a a static one
 * @type {string}
 */
/*if (process.env.MONGODB_URI) {
    var dbURI = process.env.MONGODB_URI;
} else {
    // const dbURI = 'mongodb://192.168.0.3:27017/heroku_nsrvjjs3';
    dbURI = 'mongodb://heroku_nsrvjjs3:ph5f35n89ia6g1gnjabcsh4mhg@ds249839.mlab.com:49839/heroku_nsrvjjs3'
}*/

const dbURI="mongodb://localhost:27017/horses";

/**
 * Connect mongoose to MongoDB
 */
mongoose.connect(dbURI, {useNewUrlParser: true});

/**
 * Listeners for
 * Connected - Mongoose to MongoDB connection
 * Error - Error connecting to MongoDB
 * Disconnected - Disconnected from MongoDB
 * SIGING - application level kill all
 */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log("MongoDB disconnected");
});

mongoose.connection.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('MongoDB terminated due to SIGNINT');
        process.exit(0);
    });
});


/**
 * Thou bringeth in the Models
 */

/*require('./company.js');
require('./address.js');
require('./ad.js');
require('./user.js');*/

//require('./view.js');

require('./card');
require('./race')
