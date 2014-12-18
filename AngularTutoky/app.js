(function(window, document, undefined) {



  var app = angular.module('myApplication', []);

  app.factory('LoadJson', ['$http',
    function($http) {

      return $http.get('http://academy.tutoky.com/api/json.php');
    }
    ]);

  app.directive('videoElement', function() {
    return {
      restrict: 'E',
            templateUrl: 'templateArticles.html' //dynamic template for article rendering
          };
        });

  app.directive('buttonElement', function() {
    return {
      restrict: 'E',
            templateUrl: 'templateButtons.html' //dynamic template for button rendering
          };
        });

  app.controller('commonController', ['$window', '$scope',
    function($window, $scope) {
      $scope.CurrentPage = 0;
      $scope.itemsPerPage = 10;
      $scope.selected = 0;

      $scope.wHeight = $window.innerWidth;
            //select
        $scope.categories = [{
            "value": 0,
            "text": "All"
        }, {
            "value": 1,
            "text": "Football"
        }, {
            "value": 2,
            "text": "Handball"
        }, {
            "value": 3,
            "text": "News"
        }, {
            "value": 4,
            "text": "Hockey"
        }, {
            "value": 5,
            "text": "Basketball"
        }, {
            "value": 6,
            "text": "Volleyball"
        }, {
            "value": 7,
            "text": "Galleries"
        }, ];

            // $scope.filterByCategory = function(selectedParam) {
            //     // console.log(selectedParam);
            //     $scope.selected = selectedParam;
            //     console.log($scope.selected);
            // };
          }
          ]);

app.controller('displayArticles', ['$scope', 'LoadJson',
  function($scope, LoadJson, CurrentPage) {

    LoadJson.success(function(data) {
      $scope.data = data;
      $scope.dataToBeDisplayed=[];
      // $scope.subData = [];
      $scope.subData=$scope.data;
      

      $scope.$watch('CurrentPage', function() {
        
        $scope.dataToBeDisplayed = [];
        
        var beginVal  = parseInt(0, 10);
        var endVal = parseInt(0, 10);

        if ($scope.subData.length % $scope.itemsPerPage !== 0 && $scope.CurrentPage === Math.floor($scope.subData.length / $scope.itemsPerPage)) {
          endVal = $scope.subData.length;
        } else endVal = ($scope.CurrentPage + 1) * $scope.itemsPerPage;

        if ($scope.wHeight < 690) {
          beginVal = 0;
        } else {
          beginVal = $scope.CurrentPage * $scope.itemsPerPage;
        }

          
        for (var j = beginVal; j < endVal; j++) {

          $scope.dataToBeDisplayed.push($scope.subData[j]);
 
        }
        
    });

    $scope.$watch('selected', function() {
      console.log('Selected has been changed to '+$scope.selected);
      $scope.dataToBeDisplayed = [];

      $scope.subData = [];
      if($scope.selected === 0){
        $scope.subData=$scope.data;
          
      }

      if($scope.selected === 1){
          
        for(var k in $scope.data){
            
          if($scope.data[k].image==='1'){

            
            $scope.subData.push($scope.data[k]);
            
          }
            
        }

   
      }

      
      for (var j = 0; j < 10; j++) { //repair number of rendered articles

          $scope.dataToBeDisplayed.push($scope.subData[j]);
 
        }
        
      })

      $scope.filterByCategory = function(selectedParam) {
        $scope.selected = selectedParam;  
      };


      $scope.ConvertTime = function(JSONtimestamp) {
        var d = new Date(parseInt(JSONtimestamp, 10));
        var m = d.getMonth();
        var mth = "";
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        mth = months[m];
        var formattedDate = d.getDate() + "-" + mth + "-" + d.getFullYear();
        var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
        var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
        var formattedTime = hours + ":" + minutes;
        return formattedDate + " " + formattedTime;
      };

    });

}
]);

app.controller('Pagination', ['$window', '$scope', 'LoadJson',
  function($window, $scope, LoadJson, CurrentPage) {
    var previousPage = 0;

    $scope.renderBtns = function(btn) {


      var oddVsEvenDecider = 0;
      if ($scope.subData.length % $scope.itemsPerPage === 0) {
        oddVsEvenDecider = 1;
      } else {
        oddVsEvenDecider = 0;
      }


      if (btn === 0) {
        return btn + 1;
      }

      if (btn === Math.floor($scope.subData.length / $scope.itemsPerPage) - oddVsEvenDecider) {
        return btn + 1;
      }

      if (btn <= $scope.CurrentPage + 1 && btn >= $scope.CurrentPage - 1) {

        return btn + 1;
      } else
      if (btn === 1 || btn === (Math.floor($scope.subData.length / $scope.itemsPerPage) - oddVsEvenDecider - 1)) {

        return '...';
      } else return null;


    };

    $scope.setBtnClass = function(btn) {

      var oddVsEvenDecider = 0;
      if ($scope.subData.length % $scope.itemsPerPage === 0) {
        oddVsEvenDecider = 1;
      } else {
        oddVsEvenDecider = 0;
      }

      if (btn === $scope.CurrentPage) {
        return 'navitemsActive';
      } else if (btn === $scope.CurrentPage - 1 || btn === $scope.CurrentPage + 1) {
        return 'navitemsInactive';
      } else if (btn === 0 || btn === Math.floor($scope.subData.length / $scope.itemsPerPage) - oddVsEvenDecider) {
        return 'navitemsInactive';
      } else {

        return 'threeLittleDots';
      }

    };

    LoadJson.success(function(data) {
      $scope.data = data;
      $scope.noOfPages = [];


      $scope.$watch('CurrentPage', function() {

        if ($scope.CurrentPage === 0) {

          $scope.noOfPages = [];
          for (var i = 0; i < ($scope.subData.length / $scope.itemsPerPage); i++) {
            $scope.noOfPages.push(i);
          }
        }

      });

      $scope.nextPage = function() {
        var oddVsEvenDecider = 0;
        if ($scope.subData.length % $scope.itemsPerPage === 0) {
          oddVsEvenDecider = 1;
        } else {
          oddVsEvenDecider = 0;
        }

        if ($scope.$parent.CurrentPage !== Math.floor($scope.subData.length / $scope.itemsPerPage) - oddVsEvenDecider) {
          $scope.$parent.CurrentPage += 1;
        }
      };

      $scope.prevPage = function() {
        if ($scope.$parent.CurrentPage !== 0) {
          $scope.$parent.CurrentPage -= 1;
        }
      };

      $scope.goToPage = function(page) {
        $scope.$parent.CurrentPage = page;
      };

      $scope.loadMore = function() {
        if ($scope.$parent.CurrentPage !== ($scope.subData.length / $scope.itemsPerPage) - 1) {
          $scope.$parent.CurrentPage += 1;
        }
      };


    });
}
]);

}(window, document));