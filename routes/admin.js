const { Router }=require("express");
const adminRouter=Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const z = require("zod");
const { adminModel, courseModel }=require("../db");
const { adminAuth }=require("../middlewares/admin");


adminRouter.post("/signup", async(req, res)=>{
    const { email, password, firstName, lastName }=req.body;
    const hashedPassword=bcrypt.hash(password, 3);
    try{
        const user= await adminModel.create({
            email: email,
            password: password, 
            firstName: firstName,
            lastName: lastName
        })
        res.json({
            message : "Admin signed up"
        })
    }catch(err){
        res.json({
            message: "Error Signing Up Admin"
        })
    }
})

adminRouter.post("/signin", async(req, res)=>{
    const {email, password}=req.body;
    try{
        const admin=await adminModel.findOne({
            email: email,
            password: password
        })
        if (admin){
            const token=jwt.sign({
                id: admin._id
            }, process.env.JWT_ADMIN_SECRET)
            res.json({
                token: token
            })
        }else{
            res.json({
                message: "Invalid Credentials"
            })
        }
    }catch(err){
        res.json({
            message : "Error Signing in admin"
        })
    }


})

adminRouter.post("/course", adminAuth, async(req, res)=>{
    const adminId=req.userId;
    const {title, description, imageUrl, price}=req.body;
    const course=await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })
    res.json({
        message: "Created Course",
        courseId: course._id
    })
})

adminRouter.put("/course", adminAuth, async(req, res)=>{
    const admindId= req.userId;
    const {title, description, imageUrl, price, courseId}=req.body;

    const updatedCourse=await courseModel.findOneAndUpdate({
        _id: courseId,
        creatorId: admindId
    },{
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    }, {new : true})

    res.json({
        message: "Course Updated",
        courseId: updatedCourse._id
    })
})

adminRouter.get("/course/bulk", adminAuth, async(req, res)=>{
    const adminId=req.userId;
    const courses= await courseModel.find({
        creatorId: adminId
    })
    res.json({
        message: "Courses",
        courses
    })   
})

module.exports={
    adminRouter: adminRouter
}