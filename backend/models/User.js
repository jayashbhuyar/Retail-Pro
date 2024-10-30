// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["retailer", "distributor", "admin"],
    required: true,
  },
  companyName: { type: String },
  shopName: { type: String },
  image: { type: String },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// // Hash the password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Create the User model
const User = mongoose.model("User", userSchema);
module.exports = User;

