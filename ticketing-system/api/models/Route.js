const mongoose = require('mongoose');

const routeSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   routeId: String,
   busStops: [{
      type: String
   }]
});

module.exports = mongoose.model('Route', routeSchema);
