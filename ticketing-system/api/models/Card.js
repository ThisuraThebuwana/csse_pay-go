const mongoose = require('mongoose');

const passengerSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   cardNumber: String,
   cardHolderName: String,
   expireDate: String,
   cvvNumber: String,
});

module.exports = mongoose.model('Passenger', passengerSchema);
