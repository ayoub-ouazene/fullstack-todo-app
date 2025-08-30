const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to Database"))
.catch((err) => console.error("❌ DB Connection Error:", err));


const Task = new mongoose.Schema({
   id : {type : Number , required : true},
   date : {type : Date , default: Date.now , required : true},
   description : {type : String , required : true},
   done : { type : Boolean , required : true , default : false }
});


const UserSchema = new mongoose.Schema(
    {
      id : {type : Number , unique : true},  
      name : { type : String,  required : true },
      email : { type : String , required : true},
      password : {type :String , required : true},
      tasks : { type : [Task] , default :[]}
    }
);

const User = mongoose.model("User",UserSchema,"users");

module.exports = {User};
