const { Router }= require("express");
const jwt=require("jsonwebtoken");
const brcypt=require("bcrypt");
const userRouter=Router();
const z = require("zod");
const { userModel, purchaseModel, courseModel }=require("../db");
const { userAuth } = require("../middlewares/user");

userRouter.post("/signup", async(req, res)=>{
    const { email, password, firstName, lastName }=req.body;
    const hashedPassword=brcypt.hash(password, 3);

    try{
        await userModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
        res.json({
            message: `You are Signed Up ${firstName + " "+ lastName}`
        })
    }catch(err){
        res.json({
            message : "Error signing up"
        })
    }
})

userRouter.post("/signin", async(req, res)=>{
    const { email, password }=req.body;
    try{
        const user=await userModel.findOne({
            email : email,
            password : password
        })
        if (user){
            const token=jwt.sign({
                id : user._id
            }, process.env.JWT_USER_SECRET)
            res.json({
                token : token
            })
        }else{
            res.json({
                message : "Incorrect credentials"
            })
        }
        
    }catch(err){
        res.json({
            message : "Error Siging in "
        })
    }
})

userRouter.get("/purchases", userAuth, async(req, res)=>{
    const userId=req.userId;
    const purchases=await purchaseModel.find({
        userId
    })

    const courseData=await courseModel.find({
        _id:{
            $in : purchases.map(v=>v.coursesId.toString())
        }
    })

    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter: userRouter
}