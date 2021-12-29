const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },

  country: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },

  street: {
    type: String,
    default: "",
  },
  appartment: {
    type: String,
    default: "",
  },
});

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
