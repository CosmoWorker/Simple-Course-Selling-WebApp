const { Router }=require("express");
const courseRouter=Router();
const { purchaseModel, courseModel }=require("../db")
const {userAuth} =require("../middlewares/user")

courseRouter.post("/course/purchase", userAuth, async(req, res)=>{
    const userId=req.userId;
    const courseId=req.body.courseId;
    await purchaseModel.create({
        userId, 
        courseId
    })
    res.json({
        message : "Course Purchased"
    })
})

courseRouter.get("/preview", async(req, res)=>{
    const courses=await courseModel.find({})
    res.json({
        message : "Course Preview",
        courses
    })
})

module.exports={
    courseRouter: courseRouter
}
