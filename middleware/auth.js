const { json } = require('body-parser');
const jwt=require('jsonwebtoken');
const User=require('../models/user');


exports.authenticate= (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        // console.log(token,'token')
        const user= jwt.verify(token,process.env.JWT_VERIFICATION);
        User.findById(user.userId).then(user =>{
            req.user=user;
            next();
        }).catch(err =>{
            {throw new Error(err)}
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({success:false})
    }
}

