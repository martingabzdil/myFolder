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
      $scope.selected =0;
      // if(localStorage['Favorites'] !== undefined){
        // $scope.selected = 8;
      // }


      $scope.wHeight = $window.innerWidth;
      //init categories
      $scope.categories = [{
            "value": 0,
            "text": "All"
        }]

    }]);

app.controller('displayArticles', ['$scope', 'LoadJson',
  function($scope, LoadJson, CurrentPage) {

    LoadJson.success(function(data) {
      $scope.data = data;
      $scope.dataToBeDisplayed = [];
      $scope.subData = $scope.data;
      
      //get all categories from JSON feed into an array
      
      var categoriesinJson=[];
      var noOfCat=0;

      for (var b in $scope.data){
        for (var c in $scope.data[b].categories){
          if (categoriesinJson.indexOf($scope.data[b].categories[c]) > -1) {
            //if the dategory exists in the array already do nothing
            } else {
            noOfCat++;
            categoriesinJson.push($scope.data[b].categories[c]);
            }
          
        }
      }

      for (var d in categoriesinJson){
        var newCatObj = {
          "value":parseInt(d)+1,
          "text":categoriesinJson[d]
        }
        $scope.categories.push(newCatObj);
      }

      if(localStorage['Favorites'] !== undefined){
           var ls = JSON.parse(localStorage['Favorites']);
           for (var i in ls){
              for (var j in $scope.subData){
                if(ls[i] === $scope.subData[j].title){
                  $scope.subData[j].categories.push('Favorites');                
                }
              }
           }
           $scope.categories.push({
                    "value": 8,
                    "text": "Favorites"
                  });
           $scope.selected = $scope.categories.length-1;
        }


      //event listener for page change
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

      //event listener for category filter
      $scope.$watch('selected', function() {

        $scope.dataToBeDisplayed = [];

        $scope.subData = [];
      
        if($scope.selected === 0){
          
          $scope.subData=$scope.data;
          
        } else {
            
          for(var k in $scope.data){
           
            if ( $scope.data[k].categories.indexOf($scope.categories[$scope.selected].text) > -1) {
              $scope.subData.push($scope.data[k]);
              }
              
          }
     
        }

        if ($scope.subData.length < $scope.itemsPerPage){
             for (var j = 0; j < $scope.subData.length; j++) {

            $scope.dataToBeDisplayed.push($scope.subData[j]);
          }
        } else {
            for (var j = 0; j < 10; j++) { 

            $scope.dataToBeDisplayed.push($scope.subData[j]);
   
          }
        }

        $scope.CurrentPage=0;

      })

      $scope.filterByCategory = function(selectedParam) {
        $scope.selected = selectedParam;  
      };
      
      $scope.setFavIcon = function(){
         if (this.video.categories.indexOf('Favorites') > -1){
            return'favActive.png';
          } 
          else{
            return 'favInactive.png';
          }
      }

      $scope.addToFavorites = function(){
          if(localStorage['Favorites'] === undefined){
            localStorage['Favorites'] = '[]';
          }
  
          if ($scope.categories[$scope.categories.length-1].text !== 'Favorites'){
            var newCatObj = {
              "value":parseInt($scope.categories.length),
              "text":'Favorites'
              } 
            $scope.categories.push(newCatObj);
          }

          if (this.video.categories.indexOf('Favorites') > -1){
            //remove from favorites
            this.video.categories.splice(this.video.categories.indexOf('Favorites'),1);
            var ls = JSON.parse(localStorage['Favorites']);
            console.log(ls);
            console.log(this.video.title);
            ls.splice(ls.indexOf(this.video.title),1);
            localStorage['Favorites'] = JSON.stringify(ls);
            console.log('Removed from Favorites');
          } 
          else{
            //add to favorites
            this.video.categories.push('Favorites');
            var ls = JSON.parse(localStorage['Favorites']);
            console.log(ls);
            ls.push(this.video.title);
            localStorage['Favorites'] = JSON.stringify(ls);
            console.log('Added to Favorites');
          }
      }

      //timestamp convert time function 
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

      if ($scope.subData.length > $scope.itemsPerPage && btn === Math.floor($scope.subData.length / $scope.itemsPerPage) - oddVsEvenDecider) {
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
      
      function reloadNoOfPages(){
        $scope.noOfPages = [];
        for (var i = 0; i < ($scope.subData.length / $scope.itemsPerPage); i++) {
            $scope.noOfPages.push(i);
        }
      }

      $scope.$watch('CurrentPage', function() {
          reloadNoOfPages();
      });

      $scope.$watch('selected', function() {
        reloadNoOfPages();
      })


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