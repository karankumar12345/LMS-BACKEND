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
    httpOnly: true, // Prevent client-side JavaScript access
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Lax", // Adjust this to "None" if cross-origin requests are used
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
    path: "/", // Ensure the cookie is accessible across your app
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    path: "/",
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
