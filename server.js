const express =require('express');
const path = require("path");
const cors =require('cors');
const fs = require("fs");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const dotenv =require('dotenv');
const connectDB =require('./config/db');
const superadminRoute =require('./routes/superAdminRoute');
const userAuthRoute =require('./routes/useAuthRoute');
const workshopadminRoute =require('./routes/workshopAdminRoute')
dotenv.config();
const app=express();
const port=process.env.PORT
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
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








app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})
