
const workshops = require("../models/workshop");
const bcrypt = require('bcrypt')

const getWorkshops = async (req, res) => {
  try {
    // const workshopList = await workshops.find().lean();
    const workshopList = await workshops.find().lean();
    const user = {
      name: req.user.name,
      email: req.user.email,
      role: "superadmin"
    };
    // res.status(200).send(workshop)
    // res.status(200).json({
    //   success: true,
    //   count: workshopList.length,
    //   data: workshopList
    // });
    res.render("superadmin/manageworkshops", {
      title: "Manage Workshops",
      workshopList,
      user,
      activePage: "workshops"
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }

};



const addWorkshop = async (req, res) => {

  try {
    const { name, ownername, email, phone, city, state, password } = req.body;


    if (!name || !ownername || !email || !phone || !city || !state || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }


    const existingWorkshop = await workshops.findOne({ email });
    if (existingWorkshop) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newWorkshop = new workshops({
      name,
      ownername,
      email,
      phone,
      city,
      state,
      password: hashedPassword,
    });


    await newWorkshop.save();

    // console.log("Workshop created:", newWorkshop);

    return res.status(201).json({
      success: true,
      message: "Workshop added successfully",
      data: newWorkshop
    });

  } catch (err) {
    console.error("Add Workshop Error:", err.message, err.stack);

    return res.status(500).json({
      success: false,
      message: "Server error - check logs for details",
      error: err.message
    });
  }
};



const editWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ownername, email, phone, city, state } = req.body;
    const updatedWorkshop = await workshops.findByIdAndUpdate(id, { name, ownername, email, phone, city, state },{ new: true });
    if (!updatedWorkshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.status(200).json({
      success: true,
      message: "Workshop updated successfully",
      data: updatedWorkshop
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error editing workshop" });
  }
};


const deleteWorkshop = async (req, res) => {
  try {
    const deletedWorkshop = await workshops.findByIdAndDelete(req.params.id);
    if (!deletedWorkshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.json({ success: true, message: "Workshop deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting workshop" });
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
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.status(200).json({
      success: true,
      message: "Workshop approved",
      data: workshop
    });

  } catch (err) {
    res.status(400).json({ success: false, message: "Error approving workshop" });
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
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.status(200).json({
      success: true,
      message: "Workshop blocked",
      data: workshop
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error blocking workshop" });
  }
};


const unblockWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await workshops.findByIdAndUpdate(
      id,
      { status: "approved" }, // or "active" depending on your flow
      { new: true }
    );
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.status(200).json({
      success: true,
      message: "Workshop unblocked",
      data: workshop
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error unblocking workshop" });
  }
};

const rejectWorkshop = async (req, res) => {
  try {
    const deletedWorkshop = await workshops.findByIdAndDelete(req.params.id);
    if (!deletedWorkshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.json({ success: true, message: "Workshop deleted successfully" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ success: false, message: "Error deleting workshop" });
  }
};

const getDashboard = async (req, res) => {
  const totalWorkshops = await workshops.countDocuments();
  const pendingApprovals = await workshops.find({ status: "pending" }).lean();
  // console.log(pendingApprovals)
  const totalRevenue = 2450000;

  const stats = {
    workshops: totalWorkshops,
    revenue: totalRevenue,
    approvals: pendingApprovals.length,
  };

  const user = {
    name: req.user.name,
    email: req.user.email,
    role: "superadmin"
  };

  

  res.render("superadmin/dashboard", {
    title: "Dashboard",
    user,
    stats,
    approvals: pendingApprovals,
    // revenue,
    activePage: "dashboard"
  });
};



module.exports = { getWorkshops, addWorkshop, editWorkshop, deleteWorkshop, approveWorkshop, blockWorkshop, rejectWorkshop, getDashboard,unblockWorkshop};
