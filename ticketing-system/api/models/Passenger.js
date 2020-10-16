const mongoose = require('mongoose');

const passengerSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   passengerID: String,
   username: String,
   password: String,
   name: String,
   nic: String,
   mobileNo: String,
   availableAmount: Number,
   holdAmount: Number
});

module.exports = mongoose.model('Passenger', passengerSchema);
