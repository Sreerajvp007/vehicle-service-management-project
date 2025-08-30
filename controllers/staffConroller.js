const users =require('../models/user')
const getStaff = async (req,res)=>{
    try{
        const workshop =req.user.id;
        console.log(workshop)
        const staffList = await users.find({workshopId:workshop});
         const user = {
    name: req.user.name,
    email: req.user.email,
    role: "workshopadmin"
  };
        res.render("workshopadmin/staff",{staffList,user,activePage: "staff"})
    }catch(err){
        res.status(500).send("Server error while fetching staff");

    }
}

const addStaff =async (req,res)=>{
    try{
      const { name, email, phone, experience, salary, role } = req.body;

    if (!name || !email || !phone || !experience || !salary || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }


    const existingStaff = await users.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }
    const newStaff = new users({
      name,
      email,
      phone,
      experience,
      salary,
      role,
      workshopId: req.user.id,
    });
    await newStaff.save();
    return res.status(201).json({
      success: true,
      message: "staff added successfully",
      data: newStaff
    });

    }catch(err){
      res.status(500).json({ success: false, message: err.message });

    }
}

const editStaff = async (req,res)=>{

    try{
        const staffId =req.params.id
        const { name, email, phone, experience, salary, role } = req.body;

        const updatedStaff =await users.findByIdAndUpdate(staffId,{name, email, phone, experience, salary, role},{ new: true });
       res.json({
      success: true,
      message: "staff updated successfully",
      data: updatedStaff
    });
        
    }catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
}

const deleteStaff =async (req,res)=>{
    try{
        const staffId =req.params.id;
        const deletedStaff = await users.findByIdAndDelete(staffId)
    if (!deleteStaff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

       res.json({
      success: true,
      message: "Staff deleted successfully"
    });

    }catch(err){
        res.status(500).json({ success: false, message: err.message });

    }
}

module.exports ={getStaff,addStaff,editStaff,deleteStaff}
   












