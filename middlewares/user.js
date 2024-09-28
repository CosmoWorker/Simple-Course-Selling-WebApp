const jwt=require("jsonwebtoken");
const jwtUserSecret=process.env.JWT_USER_SECRET;

const userAuth=(req, res, next)=>{
    const token=req.headers.authorization;
    if (!token){
        res.json({
            message : "You are not Signed In"
        })
    }
    try{
        const decoded=jwt.verify(token, jwtUserSecret);
        req.user=decoded.id;
        next();
    }catch(err){
        res.json({
            message : "Invalid Token"
        })
    }
}

module.exports={userAuth};  