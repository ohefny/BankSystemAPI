//var db_config=require('./db_config');
module.exports={
    getDBConnectionStr:function () {
  //      var str= db_config.key+"//"+db_config.credentials+"@"+db_config.url+"@"+db_config.port+'/'+db_config.databaseName;
    //    console.log(str);
        return "mongodb://dorgham:dorgham@ds111430.mlab.com:11430/banksystemdorgham";
    }
}