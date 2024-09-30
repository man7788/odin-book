const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  post: { type: Schema.Types.ObjectId, require: true, ref: "Post" },
  profile: { type: Schema.Types.ObjectId, require: true, ref: "Profile" },
  author: { type: String, minLength: 1, maxLength: 51 },
});

// Export model
module.exports = mongoose.model("Like", LikeSchema);
