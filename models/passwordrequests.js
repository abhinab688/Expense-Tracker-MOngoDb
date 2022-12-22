const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const passwordSchema=new Schema({
  active:{type:Boolean, required:true},
  // expiresBy:{type:Date, required:true},
  email:{type:String, required:true}
})

module.exports= mongoose.model('ResetPassword', passwordSchema)


// const Sequelize = require('sequelize');

// const sequelize = require('../models/database');

// const passwordReset = sequelize.define('PasswordReset', {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true
//   },
//   Active:Sequelize.BOOLEAN,
//   expiresby:Sequelize.DATE
// });

// module.exports = passwordReset;