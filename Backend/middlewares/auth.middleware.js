import { User } from "../models/user.model.js";
import Admin from "../models/admin.model.js";

import jwt from "jsonwebtoken";

const verifyJWT = async(req,res,next)=>{
    try {
        const token = req.cookies?.Token || req.header("Authorization")?.replace("Bearer","")

        if(!token){
            return res.status(401).json({message:"Unauthorized Request"})
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        let user;
        if(decodedToken.role == "admin"){
            user = await Admin.findOne({_id: decodedToken?.id}).select("-password")
        }else{
            user = await User.findOne({_id: decodedToken?._id}).select("-password")
        }

        if(!user){
            return res.status(401).json({message:"Invalid Access Token"})
        }

        req.user = user
        next()
    } catch (error) {
        console.log("VerifyJWT :: Invalid Token");
        throw new Error("VerifyJWT :: Invalid Token ",error)
    }
}

export default verifyJWT;