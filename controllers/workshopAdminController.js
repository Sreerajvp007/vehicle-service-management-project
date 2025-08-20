const vehicles =require('../models/vehicle')


const addVehicle = async (req,res)=>{
    try{
        const {brand, model, type} =req.body;

        if(!brand || !model || !type){
            return res.status(400).send({ message: "All fields required" })
        }
        const existingVehicle = await vehicles.findOne({
      brand,
      model,
      type,
      workshopAdmin: req.user.id
    });

    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle already exists for this workshop" });
    }
        // await vehicles.create({
        //     brand,
        //     model,
        //     type,
        //     workshopAdmin: req.user.id
        // });
        const vehicle = new vehicles({
            brand,
            model,
            type,
            workshopAdmin: req.user.id   // from JWT
        });

        await vehicle.save();
        res.status(201).json(vehicle);

        
    }catch(err){
        res.status(500).json({ message: err.message +"hii"});

    }
}

const getVehicles = async (req,res)=>{
    try{
        const vehicle =await vehicles.find({workshopAdmin:req.user.id});
        res.status(200).send(vehicle)

    }catch(err){
        res.status(500).send({message: err.message});

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

        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await vehicles.findOneAndDelete({ _id: id, workshopAdmin: req.user.id });

        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        res.json({ message: "Vehicle deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports ={addVehicle,getVehicles,updateVehicle,deleteVehicle};

