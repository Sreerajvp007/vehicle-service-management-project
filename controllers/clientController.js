
const mongoose = require("mongoose");
const Jobcards = require("../models/jobcard");

const getClients = async (req, res) => {
  try {
    const workshop = new mongoose.Types.ObjectId(req.user.id);
    
    const clients = await Jobcards.aggregate([
      { $match: { workshopAdmin: workshop } },

      { 
        $group: {
          _id: "$phone", 
          clientname: { $first: "$clientname" },
          email: { $first: "$email" },
          phone: { $first: "$phone" },
          vehicles: { $addToSet: "$registrationNumber" }, 
          services: { $sum: 1 },
          lastVisit: { $max: "$dateTimeIn" } 
        }
      },

      { 
        $project: {
          _id: 0,
          clientname: 1,
          email: 1,
          phone: 1,
          vehicles: { $size: "$vehicles" }, 
          services: 1,
          lastVisit: 1
        }
      }
    ]);
    
    const user = {
    name: req.user.name,
    email: req.user.email,
    role: "workshopadmin"
    };
  
    res.render("workshopadmin/client",{clients,user,activePage: "client"})
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).send("Server Error");
  }
};


const getServiceHistory = async (req, res) => {
  const phone = req.params.phone; 
  try {
    const workshop = new mongoose.Types.ObjectId(req.user.id);

    const serviceHistory = await Jobcards.find({
      workshopAdmin: workshop,
      phone: phone   
    })
    .populate("vehicle")
    .sort({ dateTimeIn: -1 }); 
    const user = {
      name: req.user.name,
      email: req.user.email,
      role: "workshopadmin"
    };
    res.render("workshopadmin/serviceHistory", { serviceHistory, user, activePage: "" });
  } catch (err) {
    console.error("Error fetching service history:", err);
    res.status(500).send("Error fetching service history");
  }
};




module.exports = { getClients,getServiceHistory};
