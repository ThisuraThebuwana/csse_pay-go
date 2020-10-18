const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   userName: String,
   password: String
});

module.exports = mongoose.model('User', UserSchema);
