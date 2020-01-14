var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Craigslist');

router.get('/', function (req, res) {
    var collection = db.get('posts');
    collection.find({}, function (err, posts) {
        if (err) throw err;
        res.json(posts);
    });
});

router.get('/:category', function (req, res) {
    var collection = db.get('posts');
    collection.find({category: req.params.category}, function (err, posts) {
        if (err) throw err;
        res.json(posts);
    });
});

router.get('/:category/:type', function (req, res) {
    var collection = db.get('posts');
    collection.find({category: req.params.category, type: req.params.type}, function (err, posts) {
        if (err) throw err;
        res.json(posts);
    });
});

module.exports = router;