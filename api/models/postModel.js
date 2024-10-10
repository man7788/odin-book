const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
    author: { type: String, required: true, minLength: 1, maxLength: 51 },
    text_content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
  },
  { timestamps: true },
);

// Export model
module.exports = mongoose.model('Post', PostSchema);
