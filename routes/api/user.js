var express = require('express');
var router = express.Router();
var repo = require('../../Models/Repository');
var ErrorType = require('../../ErrorTypes')
/* GET home page. */
router.get('/', function (req, res, next) {
    // console.log(repo.isDataBaseConnected);
    res.render('index', {title: 'Banking System API Page'});
});


/*router.get('/login', function (req, res, next) {
    var accNum=req.query.accountNumber;
    var pass=req.query.password;
    repo.login(accNum,pass,(errType,acc)=>{
        if(errType){
            res.status(401).end(errType.msg);
        }
        else{
            res.send(acc);
        }
    });
});*/
router.post('/login', function (req, res, next) {
    var accNum=req.body.accountNumber;
    var pass=req.body.password;
    repo.login(accNum,pass,(errType,acc)=>{
        if(errType){
            res.status(400).send(errType.msg);
        }
        else{
            res.send(acc);
        }
    });
});
router.post('/register',function (req,res,next) {
    repo.saveAccount(req.body, (errType,acc) => {
        if(errType) {
            res.status(400).send(errType.msg);
        }
        else
            res.send(acc);
    });
});
module.exports = router;
