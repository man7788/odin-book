const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  following: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
});

// Export model
module.exports = mongoose.model("Follower", FollowerSchema);
