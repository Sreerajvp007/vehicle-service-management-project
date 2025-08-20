const express =require('express');
const router =express.Router();
const {signupUser,loginUser,logoutUser,showloginPage,showSignupPage} =require('../controllers/authController');


router.get("/signup",showSignupPage);
router.get("/login",showloginPage );
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post('/logout',logoutUser);


module.exports =router;