const jwt = require('jsonwebtoken');

require('dotenv').config();

// For handling refresh tokens if needed (e.g., in Redis for token blacklist)
const sendToken = async (user, statusCode, res) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10) * 60; // Convert minutes to seconds
  const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "59", 10) * 60; // Convert minutes to seconds

  const accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  const refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  // Store refresh token in Redis or another persistent store for handling token revocation
  // await redisClient.set(user.id, refreshToken, { EX: refreshTokenExpire });

  // Set tokens as cookies
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  // Send response with token and user data
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};

module.exports = sendToken;
