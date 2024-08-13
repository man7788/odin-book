const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, minLength: 1, maxLength: 200 },
  first_name: { type: String, required: true, minLength: 1, maxLength: 100 },
  last_name: { type: String, required: true, minLength: 1, maxLength: 100 },
  password: { type: String, required: true, minLength: 8, maxLength: 200 },
});

// Export model
module.exports = mongoose.model("User", UserSchema);
