const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  profile: { type: Schema.Types.ObjectId, required: true, ref: "Profile" },
  author: { type: String, required: true, minLength: 1, maxLength: 51 },
  text_content: { type: String, required: true, minLength: 1, maxLength: 280 },
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
