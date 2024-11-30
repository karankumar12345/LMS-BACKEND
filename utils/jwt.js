const jwt = require('jsonwebtoken');
require('dotenv').config();

const sendToken = async (user, statusCode, res) => {
  // Generate access and refresh tokens
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Convert expiration times from minutes to milliseconds
  const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10) * 60 * 1000; // Default: 5 minutes
  const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "59", 10) * 60 * 1000; // Default: 59 minutes

  // Access token cookie options
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true // Ensure the cookie is accessible across your app
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true
  });
  
  // Send the response with token and user data
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};

module.exports = sendToken;
