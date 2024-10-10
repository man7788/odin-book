const mongoose = require('mongoose');

const { Schema } = mongoose;

const FollowerSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
  following: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
});

// Export model
module.exports = mongoose.model('Follower', FollowerSchema);
