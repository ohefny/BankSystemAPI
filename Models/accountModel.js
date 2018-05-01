var mongoose=require('mongoose');

var Schema=mongoose.Schema;
var accountSchema=new Schema({
    "_id":Schema.Types.ObjectId,
    "userName":String,
    "loginName":{
        type: String,
        lowercase: true,
        unique : true,
        required : true,
        dropDups: true
    },
    "password":String,
    "balance":Number
});
var account=mongoose.model('Account',accountSchema);
module.exports=account;