//connect to DB and retrieve and insert items
var mongoose = require('mongoose');
var db_config = require('../Config');
var Account = require('./accountModel');
var Activity = require('./activityModel');
var ErrorTypes = require('../ErrorTypes');
var ActivityType = require('./ActivityTypes');
var isDataBaseConnected = false;
mongoose.connect(db_config.getDBConnectionStr(), (err) => {
    if (!err)
        isDataBaseConnected = true;
});

function saveAccount(acc, reportError) {
    var errFound = false;
    if (checkAccountByUname(acc)) {
        errFound = true;
        reportError(ErrorTypes.DuplicateAccount);
    }
    if (errFound)
        return null;
    var val = new Account({
        "userName": acc.userName,
        "balance": 0,
        "password": acc.password,
        "loginName": acc.loginName
    });
    val.save((err) => {
        if (err) {
            reportError(ErrorTypes.CantSaveData);
            errFound = true;
            return;
        }
    });
    if (errFound)
        return null;
    return val;
};


function makeWithdraw(acc, value, reportError) {
    if (takeMoneyOff(acc, value, reportError)) {
        saveActivity(ActivityType.WITHDRAW, acc, value);
        return checkAccount(acc._id);
    }
    return null;
};

function makeDeposit(acc, value, reportError) {
    if (addMoney(acc, value, reportError)) {
        saveActivity(ActivityType.DEPOSIT, acc, value);
        return checkAccount(acc._id);
    }
    return null;
};

function makeTransferTo(sourceAcc, targetAcc, value, reportError) {
    if (takeMoneyOff(sourceAcc, value, reportError)) {
        if (addMoney(targetAcc, value, reportError)) {
            saveActivity(ActivityType.TRANSFER_TO, sourceAcc, value, targetAcc);
            saveActivity(ActivityType.TRANSFER_FROM, targetAcc, value, sourceAcc);
            return checkAccount(sourceAcc._id);
        }
        else {
            addMoney(sourceAcc, value, null);
        }
    }
    return null;
};

function makeDeposit(acc, value, reportError) {
    if (addMoney(acc, value, reportError)) {
        saveActivity(ActivityType.DEPOSIT, acc, value);
        return checkAccount(acc._id);
    }
    return null;
};

function inquiry(accID, reportError) {
    var acc = checkAccount({"_id": accID});
    if (acc) {
        saveActivity(ActivityType.INQUIRY, acc);
        return acc.balance;
    }
    else
        reportError(ErrorTypes.AccountNotFound)

    return null;
};

function updateAccount(targetAcc, reportError) {
    var errorFound = false;
    targetAcc.balance = newBalance;
    targetAcc.update((err) => {
        if (err) {
            reportError(ErrorTypes.CantSaveData);
            errorFound = true;
            return;
        }
    });
    return errorFound;
}

function validateBalance(balance, value, reportError) {
    if (value > balance) {
        reportError(ErrorTypes.BalanceNotEnough);
        return false;
    }
    return true;
}

function takeMoneyOff(acc, value, reportError) {
    var errorFound = false;
    var sourceAcc = checkAccount(acc);
    if (sourceAcc) {
        //validate balance and value then update account
        if (validateBalance(sourceAcc.balance, value, reportError)) {
            sourceAcc.balance = sourceAcc.balance - value;
            errorFound = updateAccount(sourceAcc, reportError);
        }
        if (errorFound)
            return null;
    }
    else {
        errorFound = true;
        reportError(ErrorTypes.AccountNotFound);
    }
    return !errorFound;
}

function addMoney(acc, value, reportError) {
    var errorFound = false;
    var sourceAcc = checkAccount(acc);
    if (sourceAcc) {
        sourceAcc.balance = sourceAcc.balance + value;
        errorFound = updateAccount(sourceAcc, reportError);
    }
    else {
        errorFound = true;
        reportError(ErrorTypes.AccountNotFound);
    }
    return !errorFound;
}

function saveActivity(type, sourceAcc, val, targetAcc) {
    var balanceBefore = sourceAcc.balance;
    if (type == ActivityType.WITHDRAW || type === ActivityType.TRANSFER_TO) {
        balanceBefore = sourceAcc.balance + val;
    }
    if (type = ActivityType.TRANSFER_FROM || type === ActivityType.DEPOSIT) {
        balanceBefore = sourceAcc.balance - val;
    }
    var activityModel = Activity({
        activityType: type,
        account: sourceAcc,
        targetAccount: null,
        balanceBefore: balanceBefore,
        balanceAfter: sourceAcc.balance
    });
    activityModel.save((err) => {
        if (!err) {

        }
    });
}

function checkAccount(acc) {
    var accountFound = null;
    Account.findById(acc._id, (err, res) => {
        if (!err) {
            accountFound = res
        }
    });
    return accountFound;
};

function checkAccountByUname(acc) {
    var accountFound = null;
    Account.find({"loginName": acc.loginName}, (err, res) => {
        if (!err) {
            accountFound = res;
        }
    });
    return accountFound;
}

module.exports = {saveAccount, inquiry, makeDeposit, makeTransferTo, makeWithdraw, isDataBaseConnected};