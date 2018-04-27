var mongoose=require('mongoose');

var Schema=mongoose.Schema;
var accountSchema=new Schema({
    "userName":String,
    "loginName":String,
    "password":String,
    "balance":Number
});
var account=mongoose.model('Account',accountSchema);
module.exports=account;