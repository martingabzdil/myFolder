var app=angular.module('myApplication',[]);

app.factory('LoadJson', ['$http',function($http){
  return $http.get('http://academy.tutoky.com/api/json.php')
  }])

app.controller('displayArticles',['$scope','LoadJson',function($scope, LoadJson){
  
  LoadJson.success(function (data){
    $scope.data=data;
    console.log($scope.data);
  })
  
}])

app.controller('renderButtons',['$scope','LoadJson',function($scope, LoadJson){
  LoadJson.success(function (data){
    $scope.data=data;
    console.log($scope.data);
  })

}])


