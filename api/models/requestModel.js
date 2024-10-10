const mongoose = require('mongoose');

const { Schema } = mongoose;

const RequestSchema = new Schema({
  from: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
  to: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
});

// Export model
module.exports = mongoose.model('Request', RequestSchema);
