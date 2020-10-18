const mongoose = require('mongoose');

const transportManagerSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   name: String,
   email: String,
});

module.exports = mongoose.model('TransportManager', transportManagerSchema);
