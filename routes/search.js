var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Craigslist');

router.get('/', function (req, res) {
    var collection = db.get('posts');
    var serchCriteria={};
    var type = req.query.type; 
    var searchkey = req.query.searchkey;
    // var type = String(type);
    // var searchkey = String(searchkey); 
    // if(type=='Any'){
    //     serchCriteria={'type': {'$regex': '', '$options': 'i'},'title': {'$regex': searchkey, '$options': 'i'}};
    // }

    // if(type=="Any"){
    // serchCriteria={
    //     'type': {'$regex': '', '$options': 'i'}, 
    //     'title': {'$regex': searchkey, '$options': 'i'}
    // };

    // }
    if(searchkey || type){
    serchCriteria={
        'type': {'$regex': type, '$options': 'i'}, 
        'title': {'$regex': searchkey, '$options': 'i'}
    };
    }
     if(type=="Any"){
     serchCriteria={
         'type': {'$regex': '', '$options': 'i'}, 
         'title': {'$regex': searchkey, '$options': 'i'}
     };

     }

    collection.find(serchCriteria, function(err, sposts){
        if(err) throw err;
        res.json(sposts);
    });


});

module.exports = router;