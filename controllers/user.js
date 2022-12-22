// const User=require('../models/user')
// const expense=require('../models/expense')
// const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User = require('../models/user');
const s3Services=require('../services/s3services');
const downloadedURLS=require('../models/downloadedURLs');


function isStringInvalid(string){
    if(string==undefined || string.length===0){
        return true
    }else{
        return false
    }
}
exports.signup=async (req,res,next) =>{
    try{
        const { name,email,password}= req.body;
        console.log(name,email,password)
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({err:'Something Is missing'})
        }
        const user= new User({
            name:name,
            email:email,
            password:password,
            expense:{
                items:[]
            }
        })
        user.save()
        res.status(201).json({message:'Sign Up Succesful'}) 
        // const saltRounds=10;
        // bcrypt.hash(password, saltRounds , async(err, hash)=>{
        //     console.log(err)
        //     // await user.create({name,email,password:hash})
            
        // })      
    }catch(err){
        console.log(err)
        } 
}
exports.login = async(req,res,next) =>{
    try{
        const {email,password}=req.body;
        await User.find({'email':email})
        .then(user=>{
            if(user.length>0){
                if(user[0].password==password){
                    return res.status(201).json({message:'Login Succesful', token:generateAccessToken(user[0].id, user[0].name)})
                }
                // bcrypt.compare(password,user[0].password, (err, result)=>{
                //     if(err){
                //         throw new Error('Something Went Wrong');
                //     }
                //     if(result===true){
                //         return res.status(201).json({message:'Login Succesful', token:generateAccessToken(user[0].id, user[0].name)})
                //     }
                //     else{
                //         return res.status(401).json({message:'Password Incorrect'})
                //     }
                // })  
                else{
                    return res.status(401).json({message:'Password Incorrect'})
                }              
            }else{
                return res.status(404).json({message:'User does not exist'})
            }
        })
        
    }catch(err){
        console.log(err)
    }

}

function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},process.env.JWT_VERIFICATION)
}

exports.addExpense= async(req,res,next)=>{
    // const userId=req.user.id;
    // console.log(userId,'<<<<<<id')
    try{
        const {amount,description,category}=req.body;
        // console.log(amount,description,category,'first')
        await req.user.addExpense(amount,description,category)
        res.status(201).json({message:'Expense added succesfully'})
    }
    catch(err){
        console.log(err)
    }
}

const EXPENSE_PER_PAGE=2;
exports.getExpense=async(req,res,next)=>{
    const page=+req.query.page || 1;
    let totalExpenses;
    const EXPENSE_PER_PAGE=+req.query.rows;
    // console.log(PER_PAGE,'<<<<<<<<<<<rows')
    User.count({'_id':req.user.id}).then(numExpenses=>{
        totalExpenses=4;
        // console.log(numExpenses,'asasas')
        req.user.populate('expense.items'
            // skip:(page-1)*EXPENSE_PER_PAGE,
            // limit:EXPENSE_PER_PAGE
        )
        .then(user=>{
            res.json({
                data:user.expense.items,
                currentPage:page,
                hasNextPage:EXPENSE_PER_PAGE * page < totalExpenses,
                hasPreviousPage:page>1,
                nextPage:page+1,
                previousPage:page-1,
            })
        })
    })
}

exports.getAllExpense=async(req,res,next)=>{
    req.user.populate('expense.items')
    .then(user=>{
        res.status(201).json({data:user.expense.items})
    })
    .catch(err=>console.log(err))
}

exports.deleteExpense=async(req,res,next)=>{
    const expId=req.params.expenseId;
    console.log(expId,'asasas')
    req.user.deleteExpense(expId).then((data)=>{
        console.log(data)
        if(data===0){
            return res.status(400).json({message:'Cannot Delete Others Expense'})
        }
        return res.status(201).json({message:'Successfully Deleted'})
    })
    .catch(err =>{
        console.log(err)
    })
}

// // For premium users to show the leaderBoard
exports.getUser=async(req,res,next)=>{
    User.find()
    .then(user=>{
        res.json({data:user})
    })
    .catch(err=>{console.log(err)})
}

exports.downloadExpense= async(req,res)=>{
    try{
        const expenses= await User.find();
        const stringifiedExpense=JSON.stringify(expenses);
        const userId=req.user.id;
        const date=new Date();
        const filename=`Expense${userId}/${date}.txt`;
        const fileURL= await s3Services.uploadToS3(stringifiedExpense, filename);
        const data= new downloadedURLS({
            url:fileURL,
            date:date,
            userId:userId
        })
        await data.save()
        res.status(200).json({fileURL, success:true, message:'Downloaded Successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:'Something went wrong'})
    }    
}

exports.getDownloadHistory=async(req,res)=>{
    try{
        const userId=req.user.id;
        await downloadedURLS.find({'userId':userId})
        .then(data=>{
            res.status(201).json({data:data, success:true})
        }).catch(err=>{
            throw new Error(err)
        })
    }catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
}


