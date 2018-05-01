var mongoose=require('mongoose')
var express = require('express');
var router = express.Router();
var repo = require('../../Models/Repository');
var ErrorType = require('../../ErrorTypes')
/* GET home page. */
router.get('/', function (req, res, next) {
    // console.log(repo.isDataBaseConnected);
    res.render('index', {title: 'Banking System API Page'});
});

router.use(function (req, res, next) {
    var loginName=req.headers['account-number'];
    var password=req.headers['password'];
    if (!loginName || ! password)
        res.status(401).end("Unauthorized Access");
    else{
        repo.login(loginName,password,(err,acc)=>{
            if(err)
                res.status(401).end("Unauthorized Access");
            else
                next();
        })
    }
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
    repo.getActivities(id,(err,activities)=>{
        if(err)
            res.status(400).end(err.msg);
        else{
            console.log(new mongoose.Types.ObjectId().getTimestamp() );
            for(var i=0;i<activities.length;i++) {
                var ac=activities[i];
                var doc=ac._doc;
                var time = mongoose.Types.ObjectId(doc._id).getTimestamp();
                doc.created_at=time;
            }
            res.send(activities);
        }
    });
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
  var value=(req.query.value);
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
    var value=(req.query.value);
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
    var value=req.body.value;
    repo.makeTransferTo(from_id,to_id,value,(err,acc)=>{
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
    var value=req.body.value
    repo.makeDeposit(acc_id,value,(err,acc)=>{
        if(err)
            res.status(400).send(err.msg);
        else
            res.send(acc);
    })
});
router.post('/withdraw', function (req, res, next) {
    var acc_id=req.body.id;
    var value=(req.body.value)
    repo.makeWithdraw(acc_id,value,(err,acc)=>{
        if(err)
            res.status(400).send(err.msg);
        else
            res.send(acc);
    })


});
module.exports = router;
