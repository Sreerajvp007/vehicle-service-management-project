
const Workshop = require("../models/workshop");
const User = require("../models/user");

const checkPrivilege = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const { role, id } = req.user;

      
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Access denied. Role not allowed." });
      }

     
      if (role === "workshopadmin") {
        const workshop = await Workshop.findById(id);
        if (!workshop) return res.status(404).json({ message: "Workshop not found" });

        if (workshop.status =="pending") {
          // return res.status(403).json({ message: "Your account is pending approval." });

          const user ={
            email:workshop.email,
            phone:workshop.phone

          }
          return res.render("waiting",{user, layout: false})
        
        }
        if (workshop.status =="blocked") {
          // return res.status(403).json({ message: "Your account is blocked. Contact admin." });
          return res.render("blocked",{layout: false})
        }
      }

      if (role === "servicemanager" || role === "technician") {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.status.includes("blocked")) {
          return res.status(403).json({ message: "Your account is blocked." });
        }
      }

      next(); 
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Privilege check failed" });
    }
  };
};

module.exports = checkPrivilege;
