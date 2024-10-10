const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, minLength: 1, maxLength: 200 },
  password: { type: String, required: true, minLength: 8, maxLength: 200 },
  profile: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
});

// Export model
module.exports = mongoose.model('User', UserSchema);
