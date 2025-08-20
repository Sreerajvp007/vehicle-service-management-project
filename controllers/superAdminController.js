
const workshops = require("../models/workshop");
const bcrypt =require('bcrypt')

const getWorkshops = async (req, res) => {
  try {
    const workshop = await workshops.find();
    res.status(200).send(workshop)
    
  } catch (err) {
    res.status(500).send("Server Error");
    console.log(err.message)
  }
  
};


const addWorkshop = async (req, res) => {
  try {
    const { name, ownername, email, phone, city, state, password } = req.body;
    if (!name || !ownername || !email || !phone || !city || !state || !password) {
      return res.status(400).send("All fields are required");
    }

  
    const salt = await bcrypt.genSalt(10);   // generate salt
    const hashedPassword = await bcrypt.hash(password, salt);

    await workshops.create({
      name,
      ownername,
      email,
      phone,
      city,
      state,
      password: hashedPassword, 
    });

    res.status(201).send("Workshop added successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error adding workshop");
  }
};


const editWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ownername, email, phone, city, state } = req.body;
    await workshops.findByIdAndUpdate(id, { name, ownername, email, phone, city, state });
    res.status(200).send("edit success")
  } catch (err) {
    res.status(400).send("Error editing workshop");
  }
};


const deleteWorkshop = async (req, res) => {
  try {
    await workshops.findByIdAndDelete(req.params.id);
    res.status(200).send("delete sucess")
  } catch (err) {
    res.status(400).send("Error deleting workshop");
  }
};


const approveWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await workshops.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    res.status(200).send("changed to approved");
    if (!workshop) return res.status(404).send("Workshop not found");
    res.status(200).send("Workshop approved");
  } catch (err) {
    res.status(400).send("Error approving workshop");
  }
};


const blockWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await workshops.findByIdAndUpdate(
      id,
      { status: "blocked" },
      { new: true }
    );
    res.status(200).send("changed to blocked");
    if (!workshop) return res.status(404).send("Workshop not found");
    res.status(200).send("Workshop blocked");
  } catch (err) {
    res.status(400).send("Error blocking workshop");
  }
};


const resetToPending = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await workshops.findByIdAndUpdate(
      id,
      { status: "pending" },
      { new: true }
    );
    res.status(200).send("changed to pending");
    if (!workshop) return res.status(404).send("Workshop not found");
    res.status(200).send("Workshop reset to pending");
  } catch (err) {
    res.status(400).send("Error resetting status");
  }
};



module.exports ={getWorkshops,addWorkshop,editWorkshop,deleteWorkshop,approveWorkshop,blockWorkshop,resetToPending};
