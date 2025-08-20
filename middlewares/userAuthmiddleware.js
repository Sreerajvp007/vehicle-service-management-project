const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
const authHeader = req.cookies["token"]

if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Add user info to request
    req.user = decoded;
    console.log(decoded)

   if(req.user.role === "superadmin"){
return res.status(403).json({ message: "get out superadmin" });  
   }else{
          next();
   }
    
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
