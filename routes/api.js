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
router.get('/account/:id', function (req, res, next) {
    var Account = require('../Models/accountModel');
    var val = new Account({
        "userName": "Ahmed",
        "balance": 0,
        "password": "99999",
        "loginName": "Ahmed Login"
    });
    var acc=repo.saveAccount(val, (errType) => {
        res.sendStatus(402);
        res.send(errType.msg);
    });
    if(acc){
        res.send(acc);
    }
});
router.get('/activities/:id', function (req, res, next) {
    var id = req.params.id;
});

router.get('/balance/:id', function (req, res, next) {
    var id = req.params.id;
});

router.post('/transfer', function (req, res, next) {

});
router.post('/deposit', function (req, res, next) {

});
router.post('/withdraw', function (req, res, next) {
    console.log(req.body.fromId);
    console.log(req.headers);
    res.json(req.body);

});
module.exports = router;
