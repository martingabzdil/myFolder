var app=angular.module('myApplication',[]);

app.factory('LoadJson', ['$http',function($http){
  return $http.get('http://academy.tutoky.com/api/json.php')
}])

app.directive('videoElement',function(){
  return {
    restrict:'E',
    templateUrl:'templateArticles.html' //dynamic template for article rendering
  };
})

app.directive('buttonElement',function(){
  return {
    restrict:'E',
    templateUrl:'templateButtons.html' //dynamic template for button rendering
  };
})

app.controller('displayArticles',['$scope','LoadJson',function($scope, LoadJson){
  LoadJson.success(function (data){
    $scope.data=data;
    $scope.ConvertTime=function(JSONtimestamp){
    var d = new Date(parseInt(JSONtimestamp,10));
    var m = d.getMonth();
    var mth="";
    var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    mth = months[m];
    var formattedDate = d.getDate() + "-" + mth + "-" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var formattedTime = hours + ":" + minutes;
    return formattedDate +" "+formattedTime;
    };

  })

}])

app.controller('Pagination',['$scope','LoadJson',function($scope, LoadJson){
  LoadJson.success(function (data){
    $scope.data=data;
    $scope.noOfPages = [];
    $scope.itemsPerPage = 15;
    for(var i=0;i<$scope.data.length/$scope.itemsPerPage;i++){
      $scope.noOfPages.push(i);
    }
    $scope.nextPage = function(){
     console.log('NEXT');
    }
    $scope.prevPage = function(){
     console.log('BACK');
    }
    $scope.goToPage = function(page){
     console.log('Go to page '+ page);
    }
  })

}])


