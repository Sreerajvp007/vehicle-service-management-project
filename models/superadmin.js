const mongoose =require('mongoose');
const superadminSchema =mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
});

const superadmin =mongoose.model('superadmin',superadminSchema);

module.exports =superadmin;