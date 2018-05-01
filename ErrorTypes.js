function ErrorType(id,msg){
    return {"id":id,"msg":msg };
}
var BalanceNotEnough=new ErrorType(1,"Not Enough Balance");
var AccountNotFound=new ErrorType(2,"Account not Found");
var CantSaveData=new ErrorType(3,"Error Saving Data");
var DuplicateAccount=new ErrorType(4,"Error this Account Number Already Exists");
var InternalServerError=new ErrorType(5,"DB can't be reached");
var CantPerformOP=new ErrorType(6,"Can't Perform Transaction");
var WrongPassOrUName=new ErrorType(7,"Can't Login Wrong Password or User Name");
module.exports= {BalanceNotEnough,AccountNotFound,CantSaveData,DuplicateAccount,InternalServerError,CantPerformOP,WrongPassOrUName};