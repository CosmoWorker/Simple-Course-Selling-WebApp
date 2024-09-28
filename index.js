const express=require("express");
const mongoose=require("mongoose");
require("dotenv").config();

const { userRouter } =require("./routes/user");
const { courseRouter } =require("./routes/course");
const { adminRouter }=require("./routes/admin");
const app=express();
app.use(express.json())
const port=process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

(async ()=>{
    await mongoose.connect(process.env.CONNECTION_STRING);
    app.listen(port);
    console.log(`Listening on port ${port}`)
})();

