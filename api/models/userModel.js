const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, minLength: 1, maxLength: 200 },
    first_name: { type: String, required: true, minLength: 1, maxLength: 100 },
    last_name: { type: String, required: true, minLength: 1, maxLength: 100 },
    password: { type: String, required: true, minLength: 8, maxLength: 200 },
  },
  { toJSON: { virtuals: true } }
);

UserSchema.virtual("full_name").get(function () {
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.first_name} ${this.last_name}`;
  }

  return fullname;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
