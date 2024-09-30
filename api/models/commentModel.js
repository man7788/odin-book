const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, require: true, ref: "Post" },
  profile: { type: Schema.Types.ObjectId, require: true, ref: "Profile" },
  author: { type: String, require: true, minLength: 1, maxLength: 51 },
  text_content: { type: String, required: true, minLength: 1, maxLength: 280 },
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);
