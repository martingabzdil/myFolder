(function(window,document,undefined){



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

  app.controller('commonController', ['$window','$scope',function($window,$scope){
    $scope.CurrentPage=0;
    $scope.itemsPerPage=10;
    $scope.wHeight=$window.innerWidth;
  }])

  app.controller('displayArticles',['$scope','LoadJson',function($scope, LoadJson, CurrentPage){

    LoadJson.success(function (data){
      $scope.data=data;
      $scope.$watch('CurrentPage', function(){

        var endVal=($scope.CurrentPage+1)*$scope.itemsPerPage;
        var beginVal;
        if($scope.wHeight<690){
          beginVal=0;
        } else {
          beginVal=$scope.CurrentPage*$scope.itemsPerPage;
        }

        $scope.subData=[];
        for(var j = beginVal; j <endVal; j++){
          $scope.subData.push($scope.data[j]);
        }

      });


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

  app.controller('Pagination',['$window','$scope','LoadJson',function($window,$scope, LoadJson, CurrentPage){
    var previousPage=0;
   
    $scope.displayButtons=function(btn){
        if(btn<2) return true;
        if(btn===7) return true;
        if(btn===2 && $scope.CurrentPage===1) return true;
      //figure this one out

    }

    $scope.renderBtns = function(btn){
        if(btn===0){
          return btn+1;
        }

        if(btn===Math.floor($scope.data.length/$scope.itemsPerPage)){
          return btn+1;
        }

        if(btn<=$scope.CurrentPage+1 && btn>=$scope.CurrentPage-1){
          return btn+1;
        } else 
            if(btn===1 || btn===6){
              return '...'
            } else return null;
        

      }

    $scope.setBtnClass = function(btn){
      if (btn===$scope.CurrentPage){
        return 'navitemsActive';
      } else return 'navitemsInactive' //return null when we have ...
       
    }

    LoadJson.success(function (data){
      $scope.data=data;
      $scope.noOfPages = [];

      $scope.$watch('CurrentPage', function(){

        if($scope.CurrentPage===0){
          console.log('condition1');
          $scope.noOfPages=[];
          for(var i=0;i<$scope.data.length/$scope.itemsPerPage;i++){
            $scope.noOfPages.push(i);
          }
        } else { //number of squares
          console.log('condition2');
          $scope.noOfPages=[];
          for(var i=0;i<$scope.data.length/$scope.itemsPerPage;i++){
            $scope.noOfPages.push(i);
          }

        }

      })

    $scope.nextPage = function(){
      if($scope.$parent.CurrentPage!==($scope.data.length/$scope.itemsPerPage)-1){
        $scope.$parent.CurrentPage+=1;        
      }
    }

    $scope.prevPage = function(){
      if($scope.$parent.CurrentPage!==0){
        $scope.$parent.CurrentPage-=1;
      }
    }

    $scope.goToPage = function(page){
      $scope.$parent.CurrentPage=page;
    }

    $scope.loadMore = function(){
     if($scope.$parent.CurrentPage!==($scope.data.length/$scope.itemsPerPage)-1){
      $scope.$parent.CurrentPage+=1;              
      }
    }


  })
}])

}(window,document));