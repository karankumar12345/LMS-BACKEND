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
  const accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire),
    maxAge: accessTokenExpire,
    httpOnly: true, // Prevent JavaScript from accessing this cookie
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" for cross-origin in production
    secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
    path: "/", // Apply the cookie to the entire site
  };

  // Refresh token cookie options
  const refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire),
    maxAge: refreshTokenExpire,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", // Make the cookie accessible across the site
  };

  // Set tokens as cookies
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  // Send the response with token and user data
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};

module.exports = sendToken;
