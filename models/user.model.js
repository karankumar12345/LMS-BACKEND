const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User schema definition
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true, // Trims any leading or trailing spaces
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: (value) => emailRegex.test(value),
        message: "Please enter a valid email",
      },
      unique: true, // Ensures email uniqueness
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
 
       // Exclude password from queries by default
    },

    role: {
      type: String,
      enum: ["user", "admin"], // Allowed roles
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        _id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// // Middleware: Hash password before saving to the database
// userSchema.pre("save", async function (next) {
//   console.log("Pre-save Middleware Triggered");
//   if (!this.isModified("password")) {
//     return next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   console.log("Password After Hashing:", this.password);
//   next();
// });

// Instance method: Compare the entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  console.log("Comparing Entered Password:", enteredPassword);
  console.log("With Stored Password:", this.password);
  return await bcrypt.compareSync(enteredPassword, this.password); 
};

// Instance method: Sign an access token
userSchema.methods.SignAccessToken = function () {
  const accessToken = jwt.sign(
    { id: this._id },
    process.env.ACCESS_TOKEN_SECRET ||"karankumar", // Fallback if ENV variable is missing
    { expiresIn: "15m" }
  );
  return accessToken;
};

// Instance method: Sign a refresh token
userSchema.methods.SignRefreshToken = function () {
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET ||"karankumar" , // Fallback if ENV variable is missing
    { expiresIn: "3d" }
  );
  return refreshToken;
};

// Create the model
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// Export the model
module.exports = UserModel;
