const mongoose = require('mongoose');

const qrSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   qrId: String,
   code: String,
   rideId: String
});

module.exports = mongoose.model('QR', qrSchema);
