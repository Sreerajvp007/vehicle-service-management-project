const mongoose =require('mongoose');



const jobcardSchema =mongoose.Schema({
    jobcardNumber: { type: String},
    jobDate: {type: Date, default: Date.now},
    workshopAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "workshop"},

// 
    clientname: {type:String, required:true},
    email: {type:String, required:true},
    phone: {type:String, required:true},
    city: {type: String },
    postcode: { type: String },
    state: { type: String },

// 
    vehicle: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"vehicle",
        
    },
    registrationNumber: { type: String },
    year: { type: Number },
    mileage: { type: String },

    // 

    dateTimeIn: { type: Date, required: true },
    dateTimeOut: { type: Date },
    serviceType: { type: String }, 
    reportedDefect: { type: String },
    
    damagedParts: [{ type: String }],

    // 


    assignedTechnician: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },

    specialInstructions: { type: String },
    technicianRemarks: { type: String },

    // 

    parts: [
        {
            partNo: String,
            partDescription: String,
            qty: Number,
            unitPrice: Number,
            lineTotal: Number,
            labour: Number
        },
    ],

    repairStatus: {
    type: String,
    enum: ["open", "in-progress", "on-hold", "completed", "delivered","cancelled"],
    default: "open",
  },

    

});

const jobcard =mongoose.model('jobcard',jobcardSchema);
module.exports =jobcard;