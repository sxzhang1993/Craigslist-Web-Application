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

// router.get('/:category', function (req, res) {
//     var collection = db.get('posts');
//     collection.find({category: req.params.category}, function (err, posts) {
//         if (err) throw err;
//         res.json(posts);
//     });
// });

// router.get('/:category/:type', function (req, res) {
//     var collection = db.get('posts');
//     collection.find({category: req.params.category, type: req.params.type}, function (err, posts) {
//         if (err) throw err;
//         res.json(posts);
//     });
// });

// router.get('/show/:id', function (req, res) {
//     var collection = db.get('posts');
//     collection.findOne({_id: req.params.id}, function (err, posts) {
//         if (err) throw err;
//         res.json(posts);
//     });
// });

router.get('/type', function (req, res) {
    var collection = db.get('posts');
    collection.find({}, function (err, posts) {
        if (err) throw err;
        //res.json(posts);


        var result = [];
        for (var i = 0, arrayLen = posts.length; i < arrayLen; i++) {
            for (var j = 0, resLen = result.length; j < resLen; j++) {
                if (result[j] == posts[i].type) {
                    break;
                }
            }
            if (j == resLen) {
                result.push(posts[i].type)
            }
        }
        res.json(result);
    });
});
router.post('/search', function (req, res) {
    var collection = db.get('posts');
    //console.log(req.body.type);
    var peopleNumber = parseInt(req.body.peopleNumber);


        collection.find({}, function (err, posts){
            search(err, posts);
        });
    function prepare(prepareList,posts,postType,peopleNumber)
    {
        for(var i=0;i<posts.length;i++)
        {
            if(posts[i].type==postType)
            {
                if(peopleNumber-parseInt(posts[i].title)>=0)
                {
                    peopleNumber=peopleNumber-parseInt(posts[i].title)
                    prepareList.push(posts[i]);
                }
            }
        }
        return peopleNumber;
    }
    function filter(choices,posts,peopleNumber,temp,index)
    {

        if(peopleNumber<=0)
        {
            choices.push(temp.map(a => {return {...a}}));

            return;
        }
        for(var i=index;i<posts.length;i++)
        {
            temp.push(posts[i]);
            peopleNumber-=parseInt(posts[i].title);
            filter(choices,posts,peopleNumber,temp.map(a => {return {...a}}),i+1);
            peopleNumber+=parseInt(posts[i].title);
            temp.pop();
        }
    }

    function postType(posts,postType,peopleNumber)
    {
        var max=-1;
        var maxoc=0;
        for(var i=0;i<posts.length;i++)
        {
            var temp=0;
            var ocNumber=0;
            for(var j=0;j<posts[i].length;j++)
            {
                if(posts[i][j].type==postType) {
                    temp++;
                }
                ocNumber += parseInt(posts[i][j].title);
            }
            if(temp>max||(temp==max&&ocNumber==peopleNumber))
            {
                max=temp;
                maxoc=ocNumber;
                var final=posts[i];
            }
        }
        return final;
    }
    function search(err,posts){
        if (err) throw err;
        //res.json(posts);

        var bag={};
        var result = [];

        var userStart = new Date(req.body.start);
        console.log(userStart.getTime);
        var userEnd = new Date(req.body.end);
        var diffDay = parseInt((userEnd-userStart)/ (1000 * 60 * 60 * 24));
        bag['diffDay'] = diffDay;

        for (var i = 0, arrayLen = posts.length; i < arrayLen; i++)
        {//judge date
            if(peopleNumber<=0){
                break;
            }
            
            if(posts[i].posted_time==null||posts[i].posted_time.length==0)
            {
                result.push(posts[i]);
                //peopleNumber -= posts[i].title;
                continue;
            }

            for (var j = 0, indexLen = posts[i].posted_time.length; j < indexLen; j++)  //judge date
            {

                var postStart = new Date(posts[i].posted_time[j].start);
                var postEnd = new Date(posts[i].posted_time[j].end);

                if (Math.max(userStart.getTime(),postStart.getTime()) < Math.min(userEnd.getTime(),postEnd.getTime()))
                {
                    //time overlap
                    break;
                }
                else
                {
                    result.push(posts[i]);
                    //peopleNumber -= posts[i].title;
                    break;
                }
            }

        }
        //filter(choices,posts,peopleNumber,temp,index)
        var choices=[];
        var temp=[];
        var final=[];
        var prepareList=[];
        //peopleNumber=prepare(prepareList,posts,req.body.postType,peopleNumber);
        filter(choices,result,peopleNumber,temp,0);
        final = postType(choices, req.body.postType,peopleNumber);


        //from here result means post in available time slot  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        if(choices.length<=0){
            bag['result']=[];
        }
        else{
            bag['result']=final;
        }

        res.json(bag);
    }
});

router.get('/capacity', function (req, res) {
    var collection = db.get('posts');
    collection.find({}, function (err, posts) {
        if (err) throw err;
        //res.json(posts);


        var result = [];
        for (var i = 0, arrayLen = posts.length; i < arrayLen; i++) {
            for (var j = 0, resLen = result.length; j < resLen; j++) {
                if (result[j] == posts[i].title) {
                    break;
                }
            }
            if (j == resLen) {
                result.push(posts[i].title)
            }
        }
        res.json(result);
    });
});

router.post('/', function (req, res) {
    var collection = db.get('posts');
    var date = new Date();
    collection.insert({
        category: req.body.category,
        type: req.body.type,
        title: req.body.title,
        content: req.body.content,
        posted_time: date.toLocaleDateString(),
        user_id : req.session.user_id,
        user_email:req.session.user_email,
        image:req.body.picture
    }, function (err, post) {
        if (err) throw err;

        res.json(post);
    });
});

router.get('/:id', function (req, res) {
    var collection = db.get('posts');
    collection.findOne({_id: req.params.id}, function (err, post) {
        if (err) throw err;

        res.json(post);
    });
});

router.put('/:id', function (req, res) {
    var collection = db.get('posts');
    collection.update({
            _id: req.params.id
        },
        {
            category: req.body.category,
            type: req.body.type,
            title: req.body.title,
            content: req.body.content,
            posted_time: req.body.posted_time,
            user_id:req.body.user_id,
            user_email:req.body.user_email,
            image:req.body.picture
        }, function (err, post) {
            if (err) throw err;

            res.json(post);
        });
});

router.delete('/:id', function (req, res) {
    var collection = db.get('posts');
    collection.remove({_id: req.params.id}, function (err, post) {
        if (err) throw err;

        res.json(post);
    });
});

module.exports = router;