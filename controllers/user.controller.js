const bcrypt = require('bcrypt');
// const  UserModel  = require("../models/user.model");
// const ErrorHandler = require("../utils/ErrorHandler");
// const { catchAsync } = require("../middleware/catchAsync");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const path = require("path");
// const  sendEmail  = require("../utils/sendMail");
// const  sendToken  = require("../utils/jwt");
const cloudinary = require("cloudinary");
const { catchAsync } = require('../middleware/catchAsync');
const UserModel = require('../models/user.model');
const sendEmail = require('../utils/sendMail');
const ErrorHandler = require('../utils/ErrorHandler');
const sendToken = require('../utils/jwt');

const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "5m", // Token expires in 5 minutes
    }
  );
  return {
    token,
    activationCode,
  };
};

const IActivatedUSer = catchAsync(async (req, res, next) => {
  try {
    const { activation_token, activation_code } = req.body;
    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user = await UserModel.create({ name, email, password });
    await sendToken(user, 200, res);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const RegisterController = catchAsync(async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    // Check if email already exists
    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exists", 400));
    }
    const saltRounds = 10;
    // Create user object and hash password before saving
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const user = new UserModel({
      name,
      email,
      password: hash, // Save the hashed password
    });

    // Generate activation token
    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;

    // Prepare data for the email template
    const data = { user: { name: user.name }, activationCode, year: new Date().getFullYear() };

    // Render the email HTML with EJS
    const html = await ejs.renderFile(
      path.join(__dirname, "../mail/mail.ejs"), data
    );

    try {
      // Send activation email
      await sendEmail({
        email: user.email,
        subject: "Activate your account",
        template: "mail.ejs", // Use correct template
        data, // Pass the data object with user info and activation code
      });

      // Send response to the client
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account.`,
        activationToken: activationToken.token, // Send token for potential further actions
      });
    } catch (error) {
      return next(new ErrorHandler(`Failed to send email: ${error.message}`, 500));
    }
  } catch (error) {
    next(error);
  }
});
const loginUser = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find user by email, include password
    const user = await UserModel.findOne({ email }).select("+password");
    console.log("User:", user);
    if (!user) {
      console.log("User not found or invalid email.");
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    // Compare entered password with stored hashed password
    const isPasswordMatch = await bcrypt.compareSync(password, user.password);
    console.log("Password Match:", isPasswordMatch);
    if (!isPasswordMatch) {
      console.log("Password did not match.");
      return next(new ErrorHandler("Invalid password", 400));
    }

    // Generate tokens and send a response
    await sendToken(user, 200, res);
    console.log("Login successful.");
  } catch (error) {
    console.error("Login Error:", error);
    return next(new ErrorHandler(error.message, 400));
  }
});


const logoutUser = catchAsync(async (req, res, next) => {
  try {
    res.cookie("accessToken", "", {
      expires: new Date(0),
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updateAccessToken = catchAsync(async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshToken;

    console.log(refresh_token)
    if (!refresh_token) {
      return next(new ErrorHandler("Refresh token not found", 400));
    }

 
    const decoded = jwt.verify(refresh_token, "karankumar");

    if (!decoded || !decoded.id) {
      return next(new ErrorHandler("Invalid refresh token", 400));
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const accessToken = jwt.sign({ id: user._id }, "karankumar", {
      expiresIn: '5m', // Access token expires in 5 minutes
    });

    const newRefreshToken = jwt.sign({ id: user._id }, "karankumar", {
      expiresIn: '3d', // Refresh token expires in 3 days
    });

    res.cookie('accessToken', accessToken, {
      maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    console.log("Access Token: when refresh page ", accessToken);
    res.status(200).json({
      success: true,
      accessToken,
      
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler("Refresh token has expired, please log in again", 401));
    }
    return next(new ErrorHandler(error.message, 500));
  }
});

const getUserInfo = catchAsync(async (req, res, next) => {
  try {

 

    const user=await UserModel.findOne(req.user._id)



    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
      return next(new ErrorHandler(error.message, 500));
  }
});


const socialAuth = catchAsync(async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      await sendToken(user, 200, res);
    } else {
      const newUser = await UserModel.create({ email, name, avatar });
      await sendToken(newUser, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updateUserInfo = catchAsync(async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User information updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updatePassword = catchAsync(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await UserModel.findById(userId).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid old password", 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updateProfilePicture = catchAsync(async (req, res, next) => {

    const userId = req.user._id;

    if (!req.file) {
      return next(new ErrorHandler('No file uploaded', 400));
    }
  
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
  
    // Find user and update avatar
    const user = await UserModel.findById(userId);
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }
  
    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      avatar: result.secure_url,
    });
  });

const getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await UserModel.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updateUserRole = catchAsync(async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const deleteUserbyAdmin = catchAsync(async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = {
  RegisterController,
  IActivatedUSer,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  getAllUsers,
  updateUserRole,
  deleteUserbyAdmin,
};
