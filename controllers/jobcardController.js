const jobcards =require('../models/jobcard');
const vehicle =require('../models/vehicle');
const users =require('../models/user')
const generateJobcardNumber = require('../utils/generateUuid');
const cloudinary =require('../utils/cloudinary');




const jobcardCreatePage =async (req,res)=>{
    const workshop =req.user.id;
    const vehicleList =await vehicle.find({workshopAdmin:workshop});
    const technicianList =await users.find({workshopId:workshop,role:"technician"})
    const user = {
    name: req.user.name,
    email: req.user.email,
    role: "workshopadmin"
    };
    res.render("createjobcard",{user,activePage: "jobcardCreate",vehicleList,technicianList })

}
const jobcardEditPage = async (req, res) => {
    try {
        const workshop = req.user.id;
        const jobcardId = req.params.id; // Get job card ID from URL params
        
        // Fetch the specific job card
        const jobcard = await jobcards.findById(jobcardId)
            .populate('vehicle')
            .populate('assignedTechnician');
        
        if (!jobcard) {
            return res.status(404).send('Job card not found');
        }

        const vehicleList = await vehicle.find({ workshopAdmin: workshop });
        const technicianList = await users.find({ workshopId: workshop, role: "technician" });
        
        const user = {
            name: req.user.name,
            email: req.user.email,
            role: "workshopadmin"
        };
        
        res.render("Editjobcard", { 
            user, 
            activePage: "jobcardEdit", 
            vehicleList, 
            technicianList,
            jobcard // Pass the jobcard data to the view
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error while loading edit page");
    }
}


const getAllJobcards =async (req,res)=>{

    const workshop =req.user.id;
    const jobcardList = await jobcards.find({workshopAdmin:workshop})
      .populate("vehicle")          
      .populate("assignedTechnician")
 

          const user = {
    name: req.user.name,
    email: req.user.email,
    role: "workshopadmin"
  };
 
   
    res.render("jobcard",{jobcardList,user,activePage:"jobcard"})
    

}

const createJobcard =async (req,res)=>{


  try{
      const {
      // jobDate,
      clientname,
      email,
      phone,
      city,
      postcode,
      state,
      vehicle,
      registrationNumber,
      year,
      mileage,
      dateTimeIn,
      dateTimeOut,
      serviceType,
      reportedDefect,
      assignedTechnician,
      specialInstructions,
      technicianRemarks,
      repairStatus} =req.body;

   const randomId =generateJobcardNumber();
   const jobcardNumber =`JOB#${randomId}`;

   let damagedPartsUrls=[];
   if(req.files && req.files.length>0){
    for(let file of req.files){
      const uploaded =await cloudinary.uploader.upload(file.path,{
        folder: "jobcards/damagedParts", 

      });
      damagedPartsUrls.push(uploaded.secure_url)
    }

   }
      const newJobacrd =new jobcards({
        jobcardNumber,
        // jobDate,
        workshopAdmin: req.user.id,
        clientname,
        email,
        phone,
        city,
        postcode,
        state,
        vehicle,
        registrationNumber,
        year,
        mileage,
        dateTimeIn,
        dateTimeOut,
        serviceType,
        reportedDefect,
        assignedTechnician,
        specialInstructions,
        technicianRemarks,
        repairStatus,
        damagedParts: damagedPartsUrls,

      });

      await newJobacrd.save();
     res.status(201).json({
      success: true,
      message: "staff added successfully",
      data: newJobacrd
    });
  }catch(err){
    res.status(500).json({ success: false, message: err.message });
  }


}

const updateJobcard =async (req,res)=>{
  const jobcardId =req.params.id;
  const {
      jobcardNumber,
      // jobDate,
      clientname,
      email,
      phone,
      city,
      postcode,
      state,
      registrationNumber,
      year,
      mileage,
      dateTimeIn,
      dateTimeOut,
      serviceType,
      reportedDefect,
      assignedTechnician,
      specialInstructions,
      technicianRemarks,
      repairStatus} =req.body;

      let damagedPartsUrls=[];
   if(req.files && req.files.length>0){
    for(let file of req.files){
      const uploaded =await cloudinary.uploader.upload(file.path,{
        folder: "jobcards/damagedParts", 

      });
      damagedPartsUrls.push(uploaded.secure_url)
    }

   }

      const updatedJobcard = await jobcards.findByIdAndUpdate(jobcardId,{
      jobcardNumber,
      // jobDate,
      clientname,
      email,
      phone,
      city,
      postcode,
      state,
      registrationNumber,
      year,
      mileage,
      dateTimeIn,
      dateTimeOut,
      serviceType,
      reportedDefect,
      assignedTechnician,
      specialInstructions,
      technicianRemarks,
      repairStatus,
      damagedParts: damagedPartsUrls},{new:true})


      res.json({
      success: true,
      message: "Jobcard updated successfully",
      data: updatedJobcard
    });

}


const deleteJobcard =async (req,res)=>{
  try{
    const jobcardId =req.params.id;
    const deletedJobcard = await jobcards.findByIdAndDelete(jobcardId);
    if(!deletedJobcard){
    return res.status(404).json({ message: "Jobcard not found" });
  }
  res.json({
      success: true,
      message: "Jobcard deleted successfully"
    });


  }catch(err){
    res.status(500).json({ success: false, message: err.message });

  }

}


module.exports ={jobcardCreatePage,jobcardEditPage,getAllJobcards,createJobcard,updateJobcard,deleteJobcard}