const mongoose = require('mongoose');

const rechargeSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   rechargeID: String,
   amount: String,
   rechargeDate: String,
});

module.exports = mongoose.model('Recharge', rechargeSchema);
