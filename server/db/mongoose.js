const mongoose = require('mongoose');

// Setup mongoose to use the default Promise
mongoose.Promise = global.Promise;
// Connect mongoose to my mongodb server
var server = process.env.MONGODB_URI;
mongoose.connect(server,{ useNewUrlParser: true } );

module.exports.mongoose = mongoose;