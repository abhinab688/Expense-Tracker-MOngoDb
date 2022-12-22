const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const downloadSchema= new Schema({
  url:{type:String, required:true},
  date:{type:Date, required:true},
  userId:{type:String, required:true}
})


module.exports=mongoose.model('URLs', downloadSchema)


// const Sequelize = require('sequelize');

// const sequelize = require('../models/database');

// const DownloadedURLS = sequelize.define('URLs', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   url: Sequelize.STRING,
//   date:Sequelize.DATE,
// });

// module.exports = DownloadedURLS;