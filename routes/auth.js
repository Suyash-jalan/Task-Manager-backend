const express = require("express");
const authrouter = express.Router();
const authController = require("../controllers/authController");

authrouter.get("/login", authController.getLogin);
authrouter.post("/login", authController.postLogin);
authrouter.post("/logout", authController.postLogout);
authrouter.get("/signup", authController.getSignup);
authrouter.post("/signup", authController.postSignup);
authrouter.post("/register", authController.postSignup);

authrouter.get("/auth-status", authController.getAuthStatus);

module.exports = authrouter;
