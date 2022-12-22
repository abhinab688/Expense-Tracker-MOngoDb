const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const userSchema= new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  expense:{
    items:[{
      amount:{type:Number, required : true},
      description:{type:String, required:true},
      category:{type:String, required:true}
    }]
  }
})

userSchema.methods.addExpense=function(amount,description,category){
  const userExpense=[...this.expense.items]
  userExpense.push({
    amount,description,category
  })
  this.expense.items=userExpense;
  return this.save()
}

userSchema.methods.deleteExpense= function(expId){
  const updatedExpenses=this.expense.items.filter(item=>{
    return item._id.toString() !== expId.toString()
  })
  this.expense.items=updatedExpenses;
  return this.save()
}

module.exports = mongoose.model('User', userSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../models/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING,
//   password:Sequelize.STRING,
// });

// module.exports = User;