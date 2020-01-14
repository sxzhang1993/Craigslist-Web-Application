var app = angular.module('Craigslist', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'pages/index.html',
            controller: 'indexController'
        })

        .when('/register', {
        	templateUrl: 'pages/register.html',
        	controller: 'registerController'
        })
        .when('/login', {
        	templateUrl: 'pages/login.html',
        	controller: 'loginController'
        })
		.when('/posts', {
            templateUrl: 'pages/posts.html',
            controller: 'showpostController'
		})
        .when('/search', {
            templateUrl: 'pages/search.html',
            controller: 'searchfunctionController'
        })
		.when('/add-post', {
            templateUrl: 'pages/post-form.html',
            controller: 'AddpostController'
		})
		.when('/post/edit/:id', {
            templateUrl: 'pages/post-edit.html',
            controller: 'EditpostController'
		})
		.when('/post/delete/:id', {
            templateUrl: 'pages/post-delete.html',
            controller: 'DeletepostController'
		})
        .when('/post/show/:id', {
            templateUrl: 'pages/article.html',
            controller: 'showarticleController'
        })
        .when('/reserves', {
            templateUrl: 'pages/reserves.html',
            controller: 'showReserveController'
        })
        .when('/reserves/:user_id', {
            templateUrl: 'pages/reserves.html',
            controller: 'showUserReserveController'
        })

        .when('/list/:category', {
            templateUrl: 'pages/list.html',
            controller: 'showlistController'
        })
        .when('/list/:category/:type', {
            templateUrl: 'pages/list.html',
            controller: 'showlistController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
app.controller('searchfunctionController',['$location','$scope','$resource','$filter',
    function($location, $scope,$resource,$filter){
        if(sessionStorage.getItem('user')==null){
            window.alert("Log In Please!")
            $location.path('/login');
        }

        // $scope.st=new Date();
        // $scope.et=new Date();
        var Type = $resource('/posts/type', {});
        Type.query(function(postType){
            $scope.allType = postType;
             $scope.allType.push("Any");
             $scope.selectedType=$scope.allType[$scope.allType.length-1];
            
        });

        // $scope.selectedCapacity=[{type:"Any"}];  
        // var posts = $resource('/posts/capacity', {});
        // posts.query(function(postCapacity){
        //     $scope.allCapacity = postCapacity;
        // });
        
        var postList;
        $scope.searchposts=function()
        {
            // var type=$location.search().selectedType;

            var type=$scope.selectedType;
            console.log(type);
            // console.log($scope.keyword==undefined);
            var searchkey=$scope.searchkey;
            // var searchkey=$location.search().keyword;
            console.log(searchkey);
            // var start=$filter("date")($scope.startDate.valueOf(), "MM/dd/yyyy");
            // var end=$filter("date")($scope.endDate.valueOf(), "MM/dd/yyyy");
            var sPosts=$resource('/search', {
                searchkey: searchkey,
                type: type
            });
            var contentSum = 0;
            // var serchCriteria={};
            // serchCriteria={
            // 'type': {'$regex': postType, '$options': 'i'},
            // 'title': {'$regex': searchkey, '$options': 'i'}
            // };
            console.log(sPosts);
            sPosts.query(function(sposts){
                $scope.sposts = sposts;
                postList=sposts.result;
//                console.log(postList);
//                if(postList==undefined){
////                    $scope.suggestion='Sorry, we can\'t find a post for you.';
//                    alert('Sorry, we can\'t find a post for you.')
////                    $scope.suggestionMessage=true;
////                    $scope.orderPanel=false;
//                }
//                if(postlist){
//                    $scope.suggestionMessage=false;
//                    $scope.orderPanel=true;
//                }
                               // else
                // {
                //     $scope.suggestionMessage=false;
                //     $scope.orderPanel = true;
                // }
                // for ( var i = 0; i <postList.length; i++) {
                //     console.log(contentSum);
                //     contentSum += parseInt(postList[i].content);
                // }
                // $scope.contentSum = contentSum;
                // $scope.contentSumTotal = contentSum*result.diffDay;
            });

        }

        // $scope.checkOut = function () {
        //     var start=$filter("date")($scope.startDate.valueOf(), "MM/dd/yyyy");
        //     var end=$filter("date")($scope.endDate.valueOf(), "MM/dd/yyyy");
        //     var timePair = {};
        //     timePair['start']=start;
        //     timePair['end']=end;
        //     for ( var i = 0; i <postList.length; i++) {
        //         if(postList[i].posted_time==null){
        //             postList[i].posted_time=[];
        //             postList[i].posted_time.push(timePair);
        //         }
        //         else{
        //             postList[i].posted_time.push(timePair);
        //         }
        //         var post = $resource('/posts/:id', {id: '@_id' }, {
        //             update: { method: 'PUT' }
        //         });
        //         post.update(postList[i]);

        //         var reserves=$resource('/reserves');
        //         reserves.save({},{
        //             username:sessionStorage.getItem('user'),
        //             category:postList[i].category,
        //             post_id:postList[i]._id,
        //             date:timePair})
        //     }
        //     window.alert("Reservation success！");
        //     location.reload();
        // }

        //para:searchResult
    }]);

app.controller('indexController',['$location','$scope', 
	function($location, $scope){
        $scope.category=["community","for sale","jobs"]
        $scope.type=["activities","artists","event","electronics","clothes","household","software","marketing","education"]
        $scope.community=["activities","artists","event"]
        $scope.forsale=["electronics","clothes","household"]
        $scope.jobs=["software","marketing","education"]
            if (sessionStorage.getItem('user')!=null){
                $scope.signout = true;
                $scope.AccountHref = '#/reserves/'+sessionStorage.getItem('user_id');
                $scope.LoginName = 'Welcome! ' + sessionStorage.getItem('user');
                if (sessionStorage.getItem('level')==0){
                    $scope.post = true;
                }
            }
            else{
                $scope.signout = false;
                $scope.AccountHref = '/#/login';
                $scope.LoginName = 'Log In';
            }
            $scope.signOut = function () {
                sessionStorage.clear();
                location.reload();
            }

	}]);

app.controller('loginController',['$location', '$scope', '$resource',
	function($location, $scope, $resource){
		$scope.loginUser = function(){
			var userSignIn = $resource('/users/signIn');
			userSignIn.save({}, {username: $scope.username, password: $scope.password}, function(status){
				if (status.status == true){
					sessionStorage.setItem('user', $scope.username);
					sessionStorage.setItem('level', status.level);
                    sessionStorage.setItem('user_id',status.uid);
					self.location='#/';
				}
				else{
					$scope.failureLogin = true;
				}
			});
		};

		$scope.register = function(){
			self.location = '#/register';
		};

	}]);

// registerController
app.controller('registerController', ['$scope', '$resource', '$location',
	function($scope, $resource){
		$scope.usernameValidation = function(){
			var reg = /^[0-9a-zA-Z]+$/;
			var usedUsername = $resource('users/username/:username');
			var available = false;

			usedUsername.get({username: $scope.username}, function(user) {
				if (user.status == true){
					available = true;
				}
				else{
					available = false;
				}

                if (reg.test($scope.username) && available == true){
                    $scope.usernameMessage = false
                }
                else{
                    $scope.usernameMessage = true
                }
            });
		};

		$scope.passwordValidation = function(){
			var reg = /^[0-9a-zA-Z]{6,}$/;
			if (reg.test($scope.password)){
				$scope.passwordMessage = false
			}
			else{
				$scope.passwordMessage = true
			}
		};

		$scope.emailValidation = function(){
			var reg = /^[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]{3}$/;
			if (reg.test($scope.email)){
				$scope.emailMessage = false
			}
			else{
				$scope.emailMessage = true
			}
		};

		$scope.phoneValidation = function(){
			var reg = /^[0-9]{10}$/;
            if (reg.test($scope.phone)){
                $scope.phoneMessage = false
            }
            else{
                $scope.phoneMessage = true
            }
		};
		$scope.registerUser = function () {
			if (!($scope.username==null||$scope.password==null||$scope.email==null||$scope.usernameMessage||$scope.passwordMessage||$scope.emailMessage)){
                var registerUser = $resource('/users');
                registerUser.save({}, {
                    username: $scope.username,
                    password: $scope.password,
                    email: $scope.email,
                    fullname: $scope.fullname,
                    phone: $scope.phone,
                    level: 1
				}, function (status) {
                    if (status.status == true){
                        window.alert('Register successful');
                        self.location = '#/login';
                    }
                });
			}
        }

        $scope.back = function () {
            self.location = '#/login';
        }
	}]);

// showpostController
app.controller('showpostController',
    function($scope, $resource, $location){
        if(sessionStorage.getItem('level')!=0){
            $location.path('/')
        }
        var posts = $resource('/posts', {});
        posts.query(function(posts){
            $scope.posts = posts;
        });
    });

// AddpostController
app.controller('AddpostController', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        if(sessionStorage.getItem('user')==null){
            window.alert("Log In Please!")
            $location.path('/login');
        }
        $scope.save = function(){
            var posts = $resource('/posts');
            var file = document.getElementById("myfile");
            var ps = $scope.post
            if(file.files.length!=0){
                var upload_file = file.files[0].name;
                console.log(upload_file)
                ps['picture']=upload_file
            }
            posts.save(ps, function(){
                $location.path('/posts');
            });
        };
    }]);

// EditpostController
app.controller('EditpostController', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        if(sessionStorage.getItem('level')!=0){
            $location.path('/')
        }
        var posts = $resource('/posts/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        posts.get({ id: $routeParams.id }, function(post){
            $scope.post = post;
        });

        $scope.save = function(){
            var file = document.getElementById("myfile");
            var ps = $scope.post
            if(file.files.length!=0){
                var upload_file = file.files[0].name;
                console.log(upload_file)
                ps['picture']=upload_file
            }
            posts.update(ps, function(){
                $location.path('/posts');
            });
        }
    }]);

// DeletepostController
app.controller('DeletepostController', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        if(sessionStorage.getItem('level')!=0){
            $location.path('/')
        }

        var posts = $resource('/posts/:id');

        posts.get({ id: $routeParams.id }, function(post){
            $scope.post = post;
        });

        $scope.delete = function(){
            posts.delete({ id: $routeParams.id }, function(post){
                $location.path('/posts');
            });
        }
    }]);

app.controller('showarticleController', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){

        var posts = $resource('/posts/:id');

        posts.get({ id: $routeParams.id }, function(post){
            $scope.post = post;
        });
        $scope.save=function(){
            var like = $resource('/reserves');
            like.save($scope.post, function(status){
                if(status.liked==true){
                    window.alert("You already liked this post!");
                }else{
                    window.alert("Successful!");
                }
               
            });

        };
       
    }]);

// showReserveController
app.controller('showReserveController',
    function($scope, $resource, $location){

        var Reserves = $resource('/reserves', {});
        Reserves.query(function(reserves){
            $scope.reserves = reserves;
        });
        $scope.cancel = function (_id) {
           
    
            var Reserves = $resource('/reserves/:id', {});
            Reserves.delete({id:_id}, function (reserve) {
                $location.path('/reserves');
                // var post = $resource('/posts/:id');
                // post.get({id:post_id}, function (post) {

                //     for (var i=0; i<post.posted_time.length; i++){
                //         console.log(post.posted_time[i].start);
                //         if (post.posted_time[i].start==date.start){
                //             post.posted_time.splice(i,1);
                //             break;
                //         }
                //     }

                //     var postUpdate = $resource('/posts/:id', {id: post_id }, {
                //         update: { method: 'PUT' }
                //     });
                //     postUpdate.update(post, function (result) {
                //         location.reload();
                //     });
                // }
                // );
            });
        }
    });

app.controller('showUserReserveController',
    function($scope, $resource, $location, $routeParams){
        var likes = $resource('/reserves/:user_id', {});
        var reservesList;
        likes.query({ user_id: $routeParams.user_id },function(likes){
            reservesList=likes;
            $scope.likes = likes;
        });

        var posts = $resource('/list/:category/:type', {});
        posts.query({category: $routeParams.category, type: $routeParams.type},function(posts){
            $scope.posts = posts;
        });
        
         $scope.cancel = function (_id) {
            if (confirm("Are you sure?")) {
                var Reserves = $resource('/reserves/:id', {});
            Reserves.delete({id:_id}, function (reserve) {
                location.reload();
            });
            }
            else {
                
            }
            
        }
    });

app.controller('showlistController', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        $scope.category=["community","for sale","jobs"]
        var posts = $resource('/list/:category/:type', {});
        posts.query({category: $routeParams.category, type: $routeParams.type},function(posts){
            $scope.posts = posts;
        });

        // var Subjects = $resource('/posts/:category');


        // Subjects.query(function(subjects){
        //     $scope.subjects = subjects;
        // });
    }]);



