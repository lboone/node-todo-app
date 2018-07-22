const mongoose = require('mongoose');

// Setup mongoose to use the default Promise
mongoose.Promise = global.Promise;
// Connect mongoose to my mongodb server
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports.mongoose = mongoose;