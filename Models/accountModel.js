var mongoose=require('mongoose');

var Schema=mongoose.Schema;
var accountSchema=new Schema({
    "_id":Schema.Types.ObjectId,
    "userName":String,
    "email":String,
    "phone":String,
    "accountNumber":{
        type: Number,
        unique : true,
        required : true,
    },
    "password":String,
    "balance":Number
});
var account=mongoose.model('Account',accountSchema);
module.exports=account;