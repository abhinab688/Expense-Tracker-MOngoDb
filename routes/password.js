const express=require('express');

const passwordController= require('../controllers/password');
const userAuthenticate= require('../middleware/auth');

const router=express.Router();

router.post('/forgotpassword', passwordController.forgotPassword);

router.get('/resetpassword/:email', passwordController.resetPassword);

router.get('/updatepassword/:email', passwordController.updatePassword);

module.exports=router;