(function(){
	var app = angular.module("loadJson", []);

	app.controller("loader", ['$http',function($http) {
  		var Json=this;
  		Json.file = [];
		$http.get('http://academy.tutoky.com/api/json.php').success(function(data) {
      		Json.file = data;
		}).error(function(data) {
      	// log error
    	});
	}]);

})



// app.controller("PostsCtrl", ['$http',function($http) {
//   var Json=this;
//   Json.file = [];

//   $http.get('http://academy.tutoky.com/api/json.php').
//     success(function(data) {
//       Json.file = data;

//     }).
//     error(function(data) {
//       // log error
//     });
// }]);


