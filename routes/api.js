var express = require('express');
var router = express.Router();
var repo = require('../Models/Repository');
var ErrorType = require('../ErrorTypes')
/* GET home page. */
router.get('/', function (req, res, next) {
    // console.log(repo.isDataBaseConnected);
    res.render('index', {title: 'Banking System API Page'});
});

/*router.use('/*', function (req, res, next) {
    console.log(repo.isDataBaseConnected);
    if (!repo.isDataBaseConnected) {
        res.sendStatus(500);
        res.send(ErrorType.InternalServerError.msg);
        res.end();
        return;
    }
    next();
});*/
router.post('/login', function (req, res, next) {

});
router.post('/account',function (req,res,next) {
    repo.saveAccount(req.body, (errType,acc) => {
        if(errType) {
            res.status(400).send(errType.msg);
        }
        else
            res.json(res);
    });
});
router.get('/account/:id', function (req, res, next) {
    //todo check auth headers before
    repo.checkAccountByUname(req.params.id,(err,acc)=>{
       if(err)
           res.status(400).send(err.msg);
       else
           res.send(acc);
    });

});
router.get('/activities/:id', function (req, res, next) {
    var id = req.params.id;
});

router.get('/balance/:id', function (req, res, next) {
    var id = req.params.id;
    repo.inquiry(id,(err,balance)=>{
        if(err)
            res.status(400).send(err.msg);
        else
            res.send(JSON.stringify(balance));
    })
});

router.get('/transfer', function (req, res, next) {
  var from_id=req.query.from;
  var to_id=req.query.to;
  var value=Number.parseInt(req.query.value);
  repo.makeTransferTo(from_id,to_id,value,(err,acc)=>{
      if(err){
          res.status(400).send(err.msg);
      }
      else{
          res.send(acc);
      }
  });
});
router.get('/deposit', function (req, res, next) {
    var acc_id=req.query.id;
    var value=Number.parseInt(req.query.value);
    repo.makeDeposit(acc_id,value,(err,acc)=>{
        if(err)
            res.status(400).send(err.msg);
        else
            res.send(acc);
    })
});
router.get('/withdraw', function (req, res, next) {
    var acc_id=req.query.id;
    var value=Number.parseInt(req.query.value)
    repo.makeWithdraw(acc_id,value,(err,acc)=>{
        if(err)
            res.status(400).send(err.msg);
        else
            res.send(acc);
    })


});

router.post('/transfer', function (req, res, next) {
    var from_id=req.body.from;
    var to_id=req.body.to;
    var value=Number.parseInt(req.query.value)
    repo.makeTransferTo(to_id,from_id,value,(err,acc)=>{
        if(err){
            res.status(400).send(err.msg);
        }
        else{
            res.send(acc);
        }
    });
});
router.post('/deposit', function (req, res, next) {
    var acc_id=req.body.id;
    var value=Number.parseInt(req.query.value)
    repo.makeDeposit(acc_id,value,(err,acc)=>{
        if(err)
            res.status(400).send(err.msg);
        else
            res.send(acc);
    })
});
router.post('/withdraw', function (req, res, next) {
    var acc_id=req.body.id;
    var value=Number.parseInt(req.query.value)
    repo.makeWithdraw(acc_id,value,(err,acc)=>{
        if(err)
            res.status(400).send(err.msg);
        else
            res.send(acc);
    })


});
module.exports = router;
