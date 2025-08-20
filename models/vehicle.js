const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, required: true },
    workshopAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true } 
}, { timestamps: true });


const vehicle =mongoose.model("vehicle",vehicleSchema)
module.exports = vehicle;