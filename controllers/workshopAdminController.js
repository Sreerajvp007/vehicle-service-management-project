const vehicles =require('../models/vehicle')


const getDashboard = async (req, res) => {
  try {
  
    const serviceManagers = 1;
    const technicians = 7;
    const clients = 78;
    const completedJobcards = 23;
    const pendingJobcards = 7;
    const revenue = 390000;
    const monthlyRevenue = 20000;
      
    
    const stats = {  
      revenue,
      completedJobcards,
      pendingJobcards,
      serviceManagers,
      technicians,
      clients,
      monthlyRevenue
    };

    const user = {
    name: req.user.name,
    email: req.user.email,
    role: "workshopadmin"
  };

    res.render("workshopadmin/dashboard", { stats,title: "dashboard",user,activePage: "dashboard"});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard");
  }
};


const addVehicle = async (req,res)=>{
    try{
        const {brand, model, type} =req.body;

        if(!brand || !model || !type){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingVehicle = await vehicles.findOne({
      brand,
      model,
      type,
      workshopAdmin: req.user.id
    });

    if (existingVehicle) {
      return res.status(400).json({success: false,message: "Vehicle already exists for this workshop"});
    }
      
        const vehicle = new vehicles({
            brand,
            model,
            type,
            workshopAdmin: req.user.id   
        });

        await vehicle.save();
        res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: vehicle
    });

        
    }catch(err){
        res.status(500).json({ success: false, message: err.message });

    }
}

const getVehicles = async (req,res)=>{
    try{
        const vehicleList =await vehicles.find({workshopAdmin:req.user.id});
        // if(vehicleList.length === 0){
        //     return res.status(404).json({ success: false, message: "vehicle not found" });
        // }
         const user = {
    name: req.user.name,
    email: req.user.email,
    role: "workshopadmin"
  };
      
        
    //     res.status(200).json({
    //   success: true,
    //   count: vehicleList.length,
    //   data: vehicleList
    // });
    res.render("workshopadmin/managevehicles", { vehicles: vehicleList,title: "Manage vehicles",user,activePage: "vehicles" });

    }catch(err){
        res.status(500).json({ success: false, message: err.message });

    }
}

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, type } = req.body;

        const vehicle = await vehicles.findOneAndUpdate(
            { _id: id, workshopAdmin: req.user.id },
            { brand, model, type },
            { new: true }
        );

        if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

        res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle
    });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await vehicles.findOneAndDelete({ _id: id, workshopAdmin: req.user.id });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

        res.json({
      success: true,
      message: "Vehicle deleted successfully"
    });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports ={getDashboard,addVehicle,getVehicles,updateVehicle,deleteVehicle};

