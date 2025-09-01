const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const superAdmin = require('../models/superadmin');
const users = require('../models/user');
const workshops = require('../models/workshop');

const showloginPageSuper = (req, res) => {
  res.render("superadminlogin",{ title: "Signup", layout: false });

}
const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    const admin = await superAdmin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const passwordCheck = await bcrypt.compare(password, admin.password);
    if (!passwordCheck) {
      return res.status(400).json({ success: false, message: "Invalid password" });

    }
    const token = jwt.sign({ id: admin._id, role: "superadmin", email, name: admin.name }, process.env.JWT_SECRET, { expiresIn: "50m" });
    const bearerToken = "Bearer " + token
    res.cookie("token", bearerToken, { httpOnly: true });

    // res.status(200).json({
    //   success: true,
    //   message: "SuperAdmin login successful",
    //   token,
    //   data: { email: admin.email, role: "superadmin" }
    // });

    res.redirect("dashboard")
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }


}

const showSignupPage = async (req, res) => {
try{
    console.log("yess")
  res.render("userSignup",{ title: "Signup", layout: false });
}catch(err){
  console.log(err)
}
}
const signupUser = async (req, res) => {
  try {
    // console.log("Signup Data:", req.body);
    const { email, password, ownername, name, phone, city, state } = req.body;
    if (!email || !password || !ownername || !name || !phone || !city || !state) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    const existingWorkshop = await workshops.findOne({ email });
    if (existingWorkshop) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newWorkshop = new workshops({
      email,
      password: hashedPassword,
      ownername,
      name,
      phone,
      city,
      state
    });

    await newWorkshop.save();
    res.redirect("login")
    // res.status(201).json({
    //   success: true,
    //   message: "Workshop signup successful. Please login.",
    //   data: { email: newWorkshop.email, role: newWorkshop.role }
    // });


  } catch (err) {
    res.status(500).json({ success: false, message: "Error signing up" });
  }
}

const showloginPage = async (req, res) => {
  res.render("userlogin", { title: "Login", layout: false });
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Form Data:", req.body);
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    let user = await users.findOne({ email });
    if (!user) {
      user = await workshops.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ success: false, message: "Invalid password" });

    }
    const token = jwt.sign({ id: user._id, role: user.role, email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "50m" });
    const bearerToken = "Bearer " + token
    res.cookie("token", bearerToken, { httpOnly: true });






    if (user.role === "workshopadmin") {

      res.redirect(`/${user.role}/vehicle`)
    } else {

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        data: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }

}

const logoutSuperAdmin = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({ success: true, message: "SuperAdmin logged out successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

module.exports = { loginSuperAdmin, showloginPageSuper, signupUser, loginUser, logoutSuperAdmin, logoutUser, showloginPage, showSignupPage, };