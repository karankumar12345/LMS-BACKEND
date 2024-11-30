const express = require("express");
const { deleteUserbyAdmin, getAllUsers, getUserInfo, IActivatedUSer, loginUser, RegisterController, socialAuth, updatePassword, updateProfilePicture, updateUserInfo, updateUserRole, logoutUser, updateAccessToken } = require("../controllers/user.controller");


const {  authorizeAdmin, isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/multer");


const userrouter = express.Router();

userrouter.post('/register', RegisterController);
userrouter.post("/activate-user", IActivatedUSer);
userrouter.post("/login", loginUser);
userrouter.get("/logout", logoutUser);
userrouter.get("/refreshToken",updateAccessToken );

userrouter.get("/me",isAuthenticated, getUserInfo);
userrouter.post("/socialauth", socialAuth);

userrouter.put("/updateuserinfo",isAuthenticated, updateUserInfo);
userrouter.put("/password/update", isAuthenticated, updatePassword);
userrouter.put("/update/profilepic", isAuthenticated, upload.single('avatar'), updateProfilePicture);

userrouter.get("/getalluser", authorizeAdmin(), getAllUsers);
userrouter.put("/updateuserrole", authorizeAdmin(), updateUserRole);
userrouter.delete("/deleteuser/:id", authorizeAdmin(), deleteUserbyAdmin);

module.exports = userrouter;
