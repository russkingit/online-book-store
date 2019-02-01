var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/WebFinalProj');

router.post('/', function(req, res) {
    var collection = db.get('books');
    collection.find({Delete: 'false'}, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

var multer = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/images'); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, file.originalname); // set the file name and extension
    }
});
var upload = multer({storage: storage});
router.post('/add', upload.single('imagename'), function(req, res, next) {
    var image = req.file.filename;
   /** rest */ 
    var collection = db.get('books');
    collection.insert({
        Title: req.body.Title,
        Year: req.body.Year,
        Price:  req.body.Price,
        Category: req.body.Category,
        Inventory: req.body.Inventory,
        Delete: req.body.Delete
    }, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/updateBook', upload.single('imagename'), function(req, res, next) {
    var image = req.file.filename;
   /** rest */ 
    var collection = db.get('books');
    collection.update({
        Title: req.body.Title
    },
    {   
        $set:{
            Title: req.body.N_title,
            Year: req.body.Year,
            Price:  req.body.Price,
            Category: req.body.Category,
            Inventory: req.body.Inventory,
            Delete: req.body.Delete
        }     
    }, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/addbook', function(req, res) {
    var collection = db.get('books');
    collection.insert({
        Title: req.body.Title,
        Year: req.body.Year,
        Price:  req.body.Price,
        Category: req.body.Category,
        Inventory: req.body.Inventory,
        Delete: req.body.Delete
    }, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/updatebook', function(req, res) {
    var collection = db.get('books');
    collection.update({
        Title: req.body.Title
    },
    {   
        $set:{
            Title: req.body.new_title,
            Year: req.body.Year,
            Price:  req.body.Price,
            Category: req.body.Category,
            Inventory: req.body.Inventory,
            Delete: req.body.Delete
        }     
    }, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/checkOutUpdate', function(req, res) {
    var collection = db.get('books');
    collection.update({
        _id: req.body.bookid
    },
    {   
        $set:{
            Inventory: req.body.quantity
        }     
    }, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/deletebook', function(req, res) {
    var collection = db.get('books');
    collection.update({
        Title: req.body.Title
    },
    {
        $set:{
            Delete: "true"
        }
    }, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/search', function(req, res) {
    var collection = db.get('books');
    var search = req.body.Title;
    var searchCriteria = {Delete: 'false'};
    if (search){ 
        searchCriteria = {
            Delete: 'false',
            $or: [
            {Title : {'$regex' : search, '$options' : 'i'}},
            {Category: {'$regex' : search, '$options' : 'i'}}
            ]         
        };
    }
    collection.find(searchCriteria, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/searchAdmin', function(req, res) {
    var collection = db.get('books');
    var search = req.body.Title;
    var searchCriteria = {};
    if (search){ 
        searchCriteria = {            
            $or: [
            {Title : {'$regex' : search, '$options' : 'i'}},
            {Category: search}
            ]         
        };
    }
    collection.find(searchCriteria, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/searchInfo', function(req, res) {
    var collection = db.get('books');
    var search = req.body.Title;
    var searchCriteria = {};
    if (search){ 
        searchCriteria = {            
            Title : search,
            Delete: 'false'                                   
        };
    }
    collection.find(searchCriteria, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/class', function(req, res) {
    var collection = db.get('books');
    var search = req.body.Category;
    var searchCriteria = {Category: search, Delete: "false" };
    collection.find(searchCriteria, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

router.post('/searchByid', function(req, res) {
    var collection = db.get('books');
    var search = req.body.id;
    var searchCriteria = {_id: search};
    collection.find(searchCriteria, function(err, books){
        if (err) throw err;
        res.json(books);
    });
});

module.exports = router;