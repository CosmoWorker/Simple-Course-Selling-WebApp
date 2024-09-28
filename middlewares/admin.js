const jwt=require("jsonwebtoken");
const jwtAdminSecret=process.env.JWT_ADMIN_SECRET;

const adminAuth=(req, res, next)=>{
    const token=req.headers.authorization;
    if (!token){
        res.json({
            message : "You are not Signed In"
        })
    }
    try{
        const decoded=jwt.verify(token, jwtAdminSecret);
        req.userId=decoded.id;
        next();
    }catch(err){
        res.json({
            message : "Invalid Token"
        })
    }
}

module.exports={
    adminAuth: adminAuth
}