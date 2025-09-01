const express =require('express');
const router =express.Router();
const {signupUser,loginUser,logoutUser,showloginPage,showSignupPage} =require('../controllers/authController');
const {sendOtp,verifyOTP} =require('../controllers/otpcontroller')
router.post("/login/sendOtp", sendOtp);    // Step 1: request OTP
router.post("/login/verifyOtp", verifyOTP); // Step 2: verify OTP + login
router.get("/signup",showSignupPage);
router.get("/login",showloginPage );
router.post("/signup", signupUser);
// router.post("/login", loginUser);
router.post('/logout',logoutUser);


module.exports =router;