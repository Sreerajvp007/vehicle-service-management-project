const mongoose =require('mongoose');
const workshopSchema =mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    ownername:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    phone:{type:String,required:true},
    role: {
        type: String,
        default: 'workshopadmin'   
    },
    // isBlocked:{type:Boolean,default:false},
    // isApproved:{type:Boolean,default:false},
    status: {
        type: String,  
        enum: ['pending', 'approved', 'blocked'], 
        default: 'pending' 
    }

},{ timestamps: true });

const workshop =mongoose.model('workshop',workshopSchema);

module.exports =workshop;