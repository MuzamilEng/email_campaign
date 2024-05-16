const profileModel= require("../models/profileModel")
exports.createProfile = async (req,res)=>{
    try{
        const {firstName,lastName,password,phoneNumber,email} = req.body
        const checkEmail = await profileModel.findOne({email:email})
        if(checkEmail) return res.status(400).json({message: "Email already exists"})
        const user = await profileModel.create({
            firstName,
            lastName,
            password,
            phoneNumber,
            email
        })
        res.status(200).json({
            success:true,
            user
        })
    }catch(err){
        res.status(500).json({message: err.message});
    }
}