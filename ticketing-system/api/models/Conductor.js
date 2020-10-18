const mongoose = require('mongoose');

const conductorSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   conductorID: String,
   name: String,
});

module.exports = mongoose.model('Conductor', conductorSchema);
