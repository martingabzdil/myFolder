angular.module('commonController', [])

  .controller('commonController', ['$window', '$scope', function ($window, $scope) {
    $scope.CurrentPage = 0;
    $scope.itemsPerPage = 10;
    $scope.selected = 0;
    $scope.wHeight = $window.innerWidth;
    //init categories
    $scope.categories = [{
      "value": 0,
      "text": "All"
    }];
  }]);
  
