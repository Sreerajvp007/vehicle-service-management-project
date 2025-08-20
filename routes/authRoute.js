const express =require('express');
const router = express.Router();
const { loginSuperAdmin, signupUser, loginUser } = require("../controllers/authController.js");

router.post('/superadmin/login',loginSuperAdmin);
router.post('/user/login',loginUser);
router.post('/user/logout',logoutUser);


module.exports =router;