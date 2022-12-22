const Razorpay=require('razorpay');
const Expense = require('../models/expense');
const Orders=require('../models/orders');
const User= require('../models/user')

exports.purchasePremium= async(req,res,next)=>{
    try{
        var rzp= new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;

        rzp.orders.create({amount, currency:'INR'}, (err,order) =>{
            if(err){
                throw new Error(err)
            }
            const orderData=new Orders({
                paymentId:'null',
                orderId:order.id,
                status:'PENDING',
                userId:req.user.id
            })
            // req.user.createOrder({orderid: order.id, status:'PENDING'})
            orderData.save()
            res.status(201).json({order, key_id: rzp.key_id})
            // .then(()=>{
                
            // }).catch(err=>{
            //     throw new Error(err)
            // })
        })
    }
    catch(err){
        console.log(err)
        res.status(403).json({message: 'went wrong'})
    }
}

exports.updateTransactionStatus =async (req,res,next)=>{
    try{
        const {order_id, payment_id}=req.body;
        const order= await Orders.find({'orderId':order_id})
        // console.log(order,'<<<<<<<<order')
        order[0].paymentId=payment_id; 
        order[0].status='SUCCESSFUL';
        await order[0].save()
        return res.status(201).json({success:true, message:"Transaction Successful"})
    }
    catch(err){
        console.log(err)
        res.status(403).json({error:err, message:'Something Went Wrong'})
    }
}


//to check wether a user has premium or not
exports.getPremiumUser = (req,res,next)=>{
    Orders.find({status:'SUCCESSFUL', userId:req.user.id})
    .then(data=>{
        if(data.length>0){
            res.json({ispremiumuser:true, message:'Premium User'})
        }else{
            res.json({ispremiumuser:false, message:'Not Premium User'})
        }   
    })
    .catch(err=>{
        console.log(err)
    })
}


// //to get user expenses (premium feature)
exports.getUserDetails=async(req,res,next)=>{
    const userId= req.params.userId;
    // console.log(userId)
    User.find({'_id':userId})
    .then((user)=>{
        // console.log(user)        
        res.json({data:user})
    }).catch(err => console.log(err))
}