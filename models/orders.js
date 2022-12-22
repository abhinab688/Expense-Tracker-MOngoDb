const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const orderSchema=new Schema({
  paymentId:{type:String, required:true},
  orderId:{type:String, required:true},
  status:{type:String, required:true},
  userId:{type:String, required:true}
})

module.exports= mongoose.model('Orders', orderSchema);


// const Sequelize = require('sequelize');

// const sequelize = require('../models/database');

// const Orders = sequelize.define('orders', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   paymentid: Sequelize.STRING,
//   orderid: Sequelize.STRING,
//   status:Sequelize.STRING,
// });

// module.exports = Orders;