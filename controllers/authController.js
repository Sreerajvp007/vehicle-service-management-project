const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const superAdmin =require('../models/superadmin');
const users =require('../models/user');
const workshops =require('../models/workshop');

const showloginPageSuper =  (req,res)=>{
  res.render("superadminlogin");
  // res.send("hello");
}
const loginSuperAdmin =async (req,res)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return res.status(400).send("please fill all fields");
    }
    const admin = await superAdmin.findOne({ email });

    if (!admin){
        return res.status(400).send({ error: "Invalid email" });
    } 
    const passwordCheck = await bcrypt.compare(password, admin.password);
    if (!passwordCheck){
        return res.status(400).send({ error: "Invalid password" });

    } 
    const token = jwt.sign({ id: admin._id, role: "superadmin", email,name: admin.name }, process.env.JWT_SECRET, { expiresIn: "50m" });
    const bearerToken = "Bearer " + token
    res.cookie("token",bearerToken, { httpOnly: true});
    res.status(200).send(bearerToken);
   
}

const showSignupPage = async (req,res)=>{
  res.render("userSignup");
}
const signupUser =async (req,res)=>{
  console.log("Signup Data:", req.body);
    const {email, password, ownername, name, phone, city, state } = req.body;
    if(!email || !password || !ownername || !name || !phone || !city ||!state){
        return res.status(400).send("please fill all fields")
    }
    const existingWorkshop = await workshops.findOne({email});
    if (existingWorkshop) {
    return res.status(400).send({ error: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
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
    res.status(201).send({ success: "workshop Signup successful. Please login." });
}

const showloginPage = async (req,res)=>{
  res.render("userlogin");
}
const loginUser =async (req,res)=>{
    const { email, password } = req.body;
     console.log("Form Data:", req.body);
    if(!email || !password){
        return res.status(400).send("please fill all fields");
    }
    let user = await users.findOne({ email });
    if (!user) {
        user = await workshops.findOne({ email });
    }

    if (!user){
        return res.status(400).send({ error: "Invalid email" });
    } 
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck){
        return res.status(400).send({ error: "Invalid password" });

    } 
    const token = jwt.sign({ id: user._id,role: user.role, email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "50m" });
    const bearerToken = "Bearer " + token
    res.cookie("token",bearerToken, { httpOnly: true});



      
    

    if (user.role === "workshopadmin"){
        res.status(200).send("login success workshop admin hii" +bearerToken);
    }else{
       res.status(200).send("login success workshop admin hii" +bearerToken);
    } 
    
}

const logoutSuperAdmin = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).send({ success: "SuperAdmin logged out successfully" });
  } catch (err) {
    return res.status(500).send({ error: "Logout failed" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).send({ success: "User logged out successfully" });
  } catch (err) {
    return res.status(500).send({ error: "Logout failed" });
  }
};

module.exports ={loginSuperAdmin,showloginPageSuper,signupUser,loginUser,logoutSuperAdmin,logoutUser,showloginPage,showSignupPage,};