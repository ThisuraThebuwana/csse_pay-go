const mongoose = require('mongoose');

const rideSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   rideId: String,
   startPoint: String,
   endPoint: String,
   ticketAmount: Number,
   passengerID: String,
   date: String,
   routeId: String
});

module.exports = mongoose.model('Ride', rideSchema);
