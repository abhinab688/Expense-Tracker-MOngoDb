const uuid=require('uuid');
const sgMail = require('@sendgrid/mail');
const API_KEY=process.env.SENDGRIP_API_KEY


const User=require('../models/user');
const forgotPassword=require('../models/passwordrequests');

const bcrypt=require('bcrypt');

exports.forgotPassword= async(req,res,next)=>{
    try{
        const {email}= req.body;
        const user= await User.find({'email':email});
        if(user){
            // const id=uuid.v4();
            // const id=req.user.id;
            const data=new forgotPassword({
                active:true,
                email:email
            })
            data.save()
            .catch(err=>{
                throw new Error(err)
            })
        sgMail.setApiKey(API_KEY);
        const msg={
            to: email,
            from: 'abhinab688@gmail.com', 
            subject: 'RESET PASSWORD',
            text: 'Your Password reset link is here:',
            html: `<a href="http://localhost:3000/resetpassword/${email}">Reset password</a>`,
        }
        sgMail.send(msg)
        .then(()=>{
            res.status(201).json({message:'Link has been send to your mail id'})
        })
        .catch(err=>{ throw new Error(err)})
        } else{
            throw new Error('User not exist')
        }      
    }
    catch(err){
        console.log(err)
        return res.status(404).json({success:false, message:'User not exist'})
    }
}

exports.resetPassword=async(req,res,next)=>{
    const email= req.params.email;
    const request= await forgotPassword.find({'email':email})
    // console.log(request[0].active)
    request[0].active=false;
    await request[0].save()
    res.status(200).send(
    `<html>
        <script>
        function formsubmitted(e){
            e.preventDefault();
            console.log('called')
        }</script>
        <form action="/updatepassword/${email}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>Reset Password</button>
        </form>
    </html>`)
    res.end()
    
}

exports.updatePassword=(req,res,next)=>{
    try{
        const newPassword= req.query.newpassword;
        // const id= req.params.uuid;
        const email=req.params.email;
        console.log(newPassword,'<<<<<<passwewdd')
        // forgotPassword.findOne({where:{id:id}}).then((resetrequest)=>{}
            User.find({'email':email}).then((user)=>{
                if(user){
                    // console.log(user)
                    // const saltRounds=10;
                    // bcrypt.genSalt(saltRounds, function(err, salt){
                    //     if(err){
                    //         console.log(err)
                    //         throw new Error(err)
                    //     }
                    //     bcrypt.hash(newPassword, salt, (err,hash)=>{
                    //         if(err){
                    //             throw new Error(err)
                    //         }
                    //         user.update({password:hash}).then(()=>{
                    //             res.status(201).json({message:'Password Succesfully Updated'})
                    //         }).catch(err=>{
                    //             throw new Error(err)
                    //         })
                    //     })
                    // })
                    user[0].password=newPassword;
                    user[0].save()
                    res.status(201).json({message:'Password Succesfully Updated'})
                }else{
                    res.status(404).json({message:'User Dont Exist'})
                }

            }).catch(err=>{
                throw new Error(err)
            })
    // ).catch(err=>{
    //     throw new Error(err)
    // })
    }catch(err){
        console.log(err)
        return res.status(403).json({success:false, error:err})
    }
    
}