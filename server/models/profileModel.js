const mongoose  = require('mongoose')
const bcrypt = require("bcrypt")
const profileSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required:[true,'first name is required']
    },
    lastName:{
        type:String,
        required:[true,'last name is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    phoneNumber:{
        type:String,
        required:[true,'phone number is required']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: { 
          validator: function (value) {
            // Use a regular expression to validate the email format
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: 'Invalid email format',
        },
      },
})
profileSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})
const profileModel = mongoose.model('ProfileModel',profileSchema);
module.exports = profileModel