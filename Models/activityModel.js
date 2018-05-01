var mongoose=require('mongoose');

var Schema=mongoose.Schema;
var activitySchema=new Schema({
   "activityType":Number,
   "account":{type: mongoose.Schema.Types.ObjectId,ref:'Account'},
   "balanceBefore":Number,
   "balanceAfter":Number,
   "targetAccount":{type:Number}
});
var activity=mongoose.model('Activity',activitySchema);
module.exports=activity;