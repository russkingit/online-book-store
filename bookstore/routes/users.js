var express = require('express');
var sha384 = require('sha384');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/WebFinalProj');

router.post('/', function(req, res) {
    var collection = db.get('users');
    collection.find({user_name: req.body.username}, function(err, user){
        if (err) throw err;
      	res.json(user);
    });
});



router.post('/signup', function(req, res) {
    var collection = db.get('users');
    collection.insert({
		user_name: req.body.user_name,
		password: req.body.password,
		email:  req.body.email,
		address: req.body.address,
		admin: false
	}, function(err, user){
        if (err) throw err;
        res.json(user);
    });
});

router.post('/InCart', function(req, res) {
    var collection = db.get('users');
    var user = req.body.user_name;
    collection.find({user_name: user, "cart.bookid": req.body.bookid}, function(err, user){
        if (err) throw err;
        res.json(user);
    });
});

router.post('/addToCart', function(req, res) {
    var collection = db.get('users');
    var user = req.body.user_name;
    collection.update({user_name: user},{
        $addToSet:{
            cart : {bookid: req.body.bookid, quantity: 1},           
        }
    },function(err, user){
        if (err) throw err;
        res.json(user);
    });
});

router.post('/increaseQty', function(req, res) {
    var collection = db.get('users');
    collection.update({
        user_name: req.body.user_name,
        "cart.bookid": req.body.bookid
    },{
        $inc:{
            "cart.$.quantity": 1
        }
    }, function(err, user){
        if(err) throw err;
        res.json(user);
    });
});

router.post('/decreaseQty', function(req, res) {
    var collection = db.get('users');
    collection.update({
        user_name: req.body.user_name,
        "cart.bookid": req.body.bookid
    },{
        $inc:{
            "cart.$.quantity": -1
        }
    }, function(err, user){
        if(err) throw err;
        res.json(user);
    });
});

router.post('/removeBook', function(req, res) {
    var collection = db.get('users');
    collection.update({
        user_name: req.body.user_name,
    },{
        $pull:{
            cart: {
                bookid: req.body.bookid
            }
        }
    }, function(err, user){
        if(err) throw err;
        res.json(user);
    });
});

router.post('/checkOut', function(req, res) {
    var collection = db.get('users');
    var user = req.body.user_name;
    collection.update({user_name: user},{
        $push:{
            history : {bookid: req.body.bookid, quantity: req.body.quantity, date: Date()},           
        }
    },function(err, user){
        if (err) throw err;
        res.json(user);
    });
});

module.exports = router;