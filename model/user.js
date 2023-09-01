var mongoose = require("mongoose");
var PassportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username:String,
    passport:String,
});
UserSchema.plugin(PassportLocalMongoose);
module.exports=mongoose.model("user",UserSchema);