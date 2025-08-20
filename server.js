const express =require('express');
const path = require("path");
const cors =require('cors');
const fs = require("fs");
const ejs = require("ejs");
const cookieParser = require('cookie-parser');
const dotenv =require('dotenv');
const connectDB =require('./config/db');
const superadminRoute =require('./routes/superAdminRoute');
const userAuthRoute =require('./routes/useAuthRoute');
const workshopadminRoute =require('./routes/workshopAdminRoute')
dotenv.config();
const app=express();
const port=process.env.PORT
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());
connectDB();

// app.get("/test", (req, res) => {
//   res.send("Test route works!");
// });
app.use('/superadmin',superadminRoute);
app.use('/user',userAuthRoute);
app.use('/workshopadmin',workshopadminRoute)
// app.get('/',(req,res)=>{
//    res.render("superadmin/dashboard");
// })
// app.get("/", async (req, res) => {
//   const stats = { workshops: 10, owners: 5, users: 20 };

//   // fake logged-in user (replace with real session later)
//   const user = { name: "Super Admin", role: "superadmin" };

//   // render dashboard body first
//   const dashboardHtml = await require("ejs").renderFile(
//     path.join(__dirname, "views/superadmin/dashboard.ejs"),
//     { stats }
//   );

//   res.render("layout", {
//     title: "Super Admin Dashboard",
//     body: dashboardHtml,
//     user, // 
//   });
// });

const authmiddleware = require("./middlewares/authmiddleware");

app.get("/superadmin/dashboard", async (req, res) => {
  const stats = { workshops: 12, revenue: "$5,000", approvals: 3 };

  // ✅ user now comes from decoded JWT (req.user)
//   const user = {
//     name: req.user.name || "Unknown User", // add name to JWT later if needed
//     email: req.user.email,
//     role: req.user.role
//   };
  const user = {
    name: "sreer", // add name to JWT later if needed
    email: "sree@gmail.com",
    role: "superadmin"
  };
  const dashboardHtml = await ejs.renderFile(
    path.join(__dirname, "views/superadmin/dashboard.ejs"),
    { stats }
  );

  res.render("layout", {
    title: "Dashboard",
    body: dashboardHtml,
    user // passes user to header + sidebar
  });
});




app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})
