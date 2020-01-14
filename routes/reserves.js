var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Craigslist');

router.get('/', function(req, res) {
    var collection = db.get('reserves');
    collection.find({}, function(err, reserves){
        if (err) throw err;
        res.json(reserves);
    });
});

router.get('/:user_id', function(req, res) {
    var collection = db.get('reserves');
    collection.find({ user_id: req.params.user_id}, function(err, reserves){
        if (err) throw err;
        res.json(reserves);
    });
});

router.delete('/:id', function (req, res) {
    var collection = db.get('reserves');
    collection.remove({ _id: req.params.id }, function(err, post){
        if (err) throw err;

        res.json(post);
    });
});


router.post('/', function(req, res){
    var collection = db.get('reserves');
    collection.findOne({
        "user_id" : req.session.user_id,
        "post_id": req.body._id,
    }, function(err, re){
        if (err) throw err;
        if (re == null){
            collection.insert({
                "user_id" : req.session.user_id,
                "category" : req.body.category,
                "type" : req.body.type,
                "post_id": req.body._id,
                "date" : req.body.posted_time,
                "title" : req.body.title
            }, function(err, reserve){
                if (err) throw err;
                res.json(reserve);
            });
        }else{
            res.json({liked:true})
        }
       
    })

});

module.exports = router;
