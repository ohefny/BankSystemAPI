var db_config=require('./db_config');
module.exports={
    getDBConnectionStr:function () {
        return db_config.url+'/'+db_config.databaseName;
    }
}