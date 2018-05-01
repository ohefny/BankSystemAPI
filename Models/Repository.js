//connect to DB and retrieve and insert items
var mongoose = require('mongoose');
var db_config = require('../Config');
var BankAccount = require('./accountModel');
var Activity = require('./activityModel');
var ErrorTypes = require('../ErrorTypes');
var ActivityType = require('./ActivityTypes');
var isDataBaseConnected = false;
mongoose.connect(db_config.getDBConnectionStr(), (err) => {
    if (!err)
        isDataBaseConnected = true;
});
function login(loginName, pass, callback) {
    loginName=loginName.toLowerCase();
    BankAccount.findOne({"loginName":loginName,"password":pass},(err,res)=>{
        if(err){
            console.log(err);
            callback(ErrorTypes.CantPerformOP,null);
        }
        if(!res)
            callback(ErrorTypes.WrongPassOrUName,null);
        else
            callback(null,res);
    });
};
function saveAccount(acc, callback) {
    acc.loginName=acc.loginName.toLowerCase();
    var filter={"loginName": acc.loginName};
    BankAccount.findOne(filter, (err, res) => {
        if (res)
            callback(ErrorTypes.DuplicateAccount,null);
        else{
            var val = new BankAccount({
                "_id":new mongoose.Types.ObjectId(),
                "userName": acc.userName,
                "balance": 0,
                "password": acc.password,
                "loginName": acc.loginName
            });
            val.save(function(err) {
                if (err) {
                    console.log(err);
                    callback(ErrorTypes.CantSaveData,null);
                }
                else
                    callback(null,val._doc);


            });

        }
    });

};

//done
function makeWithdraw(acc_id, value, callback) {
    takeMoneyOff(acc_id, value, (err,res)=>{
        if(err)
            callback(err,null)
        else{
            saveActivity(ActivityType.WITHDRAW, res, value);
            /*checkAccountById(acc,(err,res)=>{
                callback(err,res);
            });*/
            callback(null,res);
        }
    });

};
//done
function makeDeposit(acc_id, value, callback) {
        addMoney(acc_id, value, (err,acc)=>{
            if(err)
                callback(err,null);
            else {
                saveActivity(ActivityType.DEPOSIT, acc, value);
                callback(null,acc);
            }
        });
};
//done
function makeTransferTo(src_acc_id, target_acc_id, value, callback) {
    var src_acc=null;
    var target_acc=null;
    takeMoneyOff(src_acc_id, value, (err,acc)=>{
        if(!err){
            src_acc=acc;
            addMoney(target_acc_id,value,(err,tar_acc)=>{
                if(!err){
                    target_acc=tar_acc;
                    saveActivity(ActivityType.TRANSFER_TO, src_acc, value, target_acc);
                    saveActivity(ActivityType.TRANSFER_FROM, target_acc, value, src_acc);
                    callback(null,src_acc);
                }
                else{
                    //rollback
                    addMoney(src_acc_id,value,(err,acc)=>{});
                    callback(err,null);
                }
            });
        }
        else
            callback(err,null);

    });

};
//done
function makeDeposit(acc_id, value, callback) {
    addMoney(acc_id, value, (err,acc)=>{
        if(err)
            callback(err,null);
        else {
            callback(null, acc);
            saveActivity(ActivityType.DEPOSIT, acc, value);
        }
    });

};
//done
function inquiry(acc_id, callback) {
    checkAccountById(acc_id,(err,acc)=>{
        if(err)
            callback(err,null);
        else{
            callback(null,acc.balance);
            saveActivity(ActivityType.INQUIRY, acc);
        }
    });

};

//done
function updateAccount(targetAcc, callback) {

    BankAccount.findByIdAndUpdate(targetAcc._id,{ $set: { balance: targetAcc.balance }}, { new: true },(err,doc) => {
        if (err) {
            console.log(err);
            callback(ErrorTypes.CantSaveData, null);
        }

        else
            callback(null,doc._doc);
    });

}
//done
function validateBalance(balance, value, reportError) {
    if (value > balance) {
        return false;
    }
    return true;
}
//done
function takeMoneyOff(acc_id, value, callback) {
    BankAccount.findById(acc_id, (err, res) => {
        var sourceAcc = res._doc;
        if (res) {
            if (validateBalance(sourceAcc.balance, value)){
                sourceAcc.balance = sourceAcc.balance - value;
                updateAccount(sourceAcc, callback);
            }
            else
                callback(ErrorTypes.BalanceNotEnough,null);
        }
        else {
            callback(ErrorTypes.AccountNotFound,null);
        }

    });

}
//done
function addMoney(accID, value, callback) {
    checkAccountById(accID,(err,resAcc)=>{
        if(err)
            callback(err,null);
        else{
            resAcc.balance=resAcc.balance+value;
            updateAccount(resAcc,callback);
        }

    });
}
//done
//todo fixx sourceAcc that replaced with acc_id
function saveActivity(type, sourceAcc, val, targetAcc) {
    var balanceBefore = sourceAcc.balance;
    if (type == ActivityType.WITHDRAW || type === ActivityType.TRANSFER_TO) {
        balanceBefore = sourceAcc.balance + val;
    }
    if (type === ActivityType.DEPOSIT||type === ActivityType.TRANSFER_FROM) {
        balanceBefore = sourceAcc.balance - val;
    }
    var activityModel = Activity({
        activityType: type,
        account: sourceAcc,
        targetAccount: targetAcc,
        balanceBefore: balanceBefore,
        balanceAfter: sourceAcc.balance
    });
    activityModel.save((err) => {
        if (err)
            console.log("Save Activity Failed ",err);
        console.log("Activity Saved");
    });
}
//done
function checkAccountById(acc_id, callback) {
    BankAccount.findById(acc_id,(err, res) => {
        if (res) {
            callback(null,res._doc);
        }
        else
            callback(ErrorTypes.AccountNotFound,null);
    });
};
//done
function checkAccountByUname(loginName,callback) {
    var filter={"loginName": loginName};
    BankAccount.findOne(filter,(err, res) => {
        if (res) {
            callback(null,res._doc);
        }
        else{
            callback(ErrorTypes.AccountNotFound,null);
        }
    });
}

module.exports = {login,saveAccount, inquiry, makeDeposit, makeTransferTo, makeWithdraw,checkAccountByUname, isDataBaseConnected};