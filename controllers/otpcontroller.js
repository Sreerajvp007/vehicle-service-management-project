const crypto =require('crypto');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const users = require('../models/user');
const workshops = require('../models/workshop');

let otpStore = {};

const sendOtp =async (req,res)=>{
    try{
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        let user =await users.findOne({email});
        if (!user) {
           user = await workshops.findOne({ email });
           if (!user){
            return res.status(400).json({ success: false, message: "Email not found" });
           } 
           const otp = crypto.randomInt(100000, 999999).toString();
           otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
           const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, 
                },
                });

           await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
                });
                res.json({ success: true, message: "OTP sent to your email" });
     

        }
    }catch(err){
        res.status(500).json({ success: false, message: "Server error" });

    }
}



const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

    const record = otpStore[email];
    if (!record) return res.status(400).json({ success: false, message: "No OTP found, request again" });

    if (record.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== otp){
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    } 
    let user = await users.findOne({ email });
    if (!user) {
      user = await workshops.findOne({ email });
    }

    if (!user) {
          return res.status(400).json({ success: false, message: "Invalid email" });
        }
      
        const token = jwt.sign({ id: user._id, role: user.role, email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "50m" });
        const bearerToken = "Bearer " + token
        res.cookie("token", bearerToken, { httpOnly: true });
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

    delete otpStore[email];
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports ={sendOtp,verifyOTP}