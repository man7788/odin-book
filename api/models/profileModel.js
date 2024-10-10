const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProfileSchema = new Schema(
  {
    first_name: { type: String, required: true, minLength: 1, maxLength: 25 },
    last_name: { type: String, required: true, minLength: 1, maxLength: 25 },
    about: { type: String, minLength: 1, maxLength: 200 },
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } },
);

// eslint-disable-next-line func-names
ProfileSchema.virtual('full_name').get(function () {
  let fullname = '';
  if (this.first_name && this.last_name) {
    fullname = `${this.first_name} ${this.last_name}`;
  }

  return fullname;
});

// Export model
module.exports = mongoose.model('Profile', ProfileSchema);
