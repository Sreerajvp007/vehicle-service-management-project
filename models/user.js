const mongoose =require('mongoose');
const userSchema =mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    workshop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: true
    },
    role: {
        type: String,
        enum: ['servicemanager', 'technician'],  // allowed roles  
    },
    // status: {
    //     type: [String],  // Array of strings
    //     enum: ['active', 'blocked'], // allowed values
    //     default: ['active']  // default value
    // }

},{ timestamps: true });

const user =mongoose.model('user',userSchema);

module.exports =user;