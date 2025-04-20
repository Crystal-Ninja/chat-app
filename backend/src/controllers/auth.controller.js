
import bcrypt from "bcryptjs"
import User from "../models/user.models.js"
import { generateToken } from "../lib/utils.js";
export const signup=async(req,res)=>{
    console.log(req.body);
    
    const {fullname,password,email}= req.body
    try {
        if (!email||!fullname||!password) {
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"The password must be at least 6 letters long"});
        }        
        const user=await User.findOne({email});
        if (user) return res.status(400).json({message:"Email already exists"});

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash("password",salt)

        const newUser= new User({
            fullname,
            email,
            password:hashedPassword,
        })

        if (newUser) {
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })

        } else {
            return res.status(400).json({message:"Invalid user name"})
        }
    } catch (error) {
        console.log("error in signup controller",error.message)
        res.status(500).json({message:"internal server error"})
    }
}
export const login=async (req,res)=>{
    const {email,password}= req.body; 
    try {
         const user=await User.findOne({email})
         if (!user) {
            return res.status(400).json({message:"invalid credentials"})
         }

         const IsPasswordCorrect=await bcrypt.compare(password,user.password)
         if (!IsPasswordCorrect) {
            return res.status(400).json({message:"invalid credentials"})            
         }
         generateToken(user._id,res)

         res.status(200).json({
            _id:user._id,
            fullname:User.fullname,
            email:User.email,
            profilePic:User.profilePic,
         })
    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({message:"internal server error"});
    }   
}
export const logout=(req,res)=>{
    res.send("logout route")
}
