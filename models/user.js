const mongoose = require("mongoose");
const gravatar = require("gravatar");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatarURL: {
    type: String,
    default: function() {
      return gravatar.url(this.email, { s: "250", d: "identicon" });
    }
  },
  subscription: {
    type: String,
    default: 'free'
  },
  token: {
    type: String,
    default: null
  },
  verify: {
    type: Boolean,
    default: false, // Implicit este neverificat
  },
 verificationToken: {
  type: String,
  default: null // Permite valori null implicit
},

});

// Evită suprascrierea modelului dacă este deja definit
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
