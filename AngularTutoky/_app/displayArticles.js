angular.module('displayArticles', ['loader'])

  .controller('displayArticles', ['$scope', 'LoadJson', function ($scope, LoadJson) {
    //$scope functions called from DOM

    //function to convert timestamp from json
    $scope.ConvertTime = function (JSONtimestamp) {
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

    //function to filter the content by category
    $scope.filterByCategory = function (selectedParam) {
      $scope.selected = selectedParam;
    };

    //function to set the star icon depending on the favorites tag
    $scope.setFavIcon = function () {
      if (this.video.categories.indexOf('Favorites') > -1) {
        return '_img/favActive.png';
      }
      return '_img/favInactive.png';
    };

    //function to ADD or REMOVE  the video into / from  favorites
    $scope.toFavorites = function () {
      /*global localStorage: false, console: false, $: false */
      if (localStorage.Favorites === undefined) {
        localStorage.Favorites = '[]';
      }

      if ($scope.categories[$scope.categories.length - 1].text !== 'Favorites') {
        var newCatObj = {
          "value": parseInt($scope.categories.length, 10),
          "text": 'Favorites'
        };
        $scope.categories.push(newCatObj);
      }

      if (this.video.categories.indexOf('Favorites') > -1) {
        //remove from favorites
        this.video.categories.splice(this.video.categories.indexOf('Favorites'), 1);
        var ls = JSON.parse(localStorage.Favorites);
        ls.splice(ls.indexOf(this.video.title), 1);
        localStorage.Favorites = JSON.stringify(ls);
      } else {
        //add to favorites
        this.video.categories.push('Favorites');
        var ls2 = JSON.parse(localStorage.Favorites);
        ls2.push(this.video.title);
        localStorage.Favorites = JSON.stringify(ls2);

      }
    };

    //functions called from inside the controller

    function changeContentByCategory() {
      var j, k;
      $scope.dataToBeDisplayed = [];
      $scope.subData = [];
      if ($scope.selected === 0) {
        $scope.subData = $scope.data;
      } else {
        for (k in $scope.data) {
          if ($scope.data.hasOwnProperty(k)) {
            if ($scope.data[k].categories.indexOf($scope.categories[$scope.selected].text) > -1) {
              $scope.subData.push($scope.data[k]);
            }
          }
        }
      }
      if ($scope.subData !== undefined) {
        if ($scope.subData.length < $scope.itemsPerPage) {
          for (j = 0; j < $scope.subData.length; j++) {
            $scope.dataToBeDisplayed.push($scope.subData[j]);
          }
        } else {
          for (j = 0; j < 10; j++) {
            $scope.dataToBeDisplayed.push($scope.subData[j]);
          }
        }
      }

      $scope.CurrentPage = 0;

    }

    function changeContentByPage() {
      var j, beginVal = parseInt(0, 10);
      var endVal = parseInt(0, 10);
      $scope.dataToBeDisplayed = [];

      if ($scope.subData !== undefined) {

        if ($scope.subData.length % $scope.itemsPerPage !== 0 && $scope.CurrentPage === Math.floor($scope.subData.length / $scope.itemsPerPage)) {
          endVal = $scope.subData.length;
        } else {
          endVal = ($scope.CurrentPage + 1) * $scope.itemsPerPage;
        }

        if ($scope.wHeight < 690) {
          beginVal = 0;
          endVal = ($scope.CurrentPage + 1) * $scope.itemsPerPage;
          for (j = beginVal; j < endVal; j++) {
            $scope.dataToBeDisplayed.push($scope.subData[j]);
          }
        } else {
          beginVal = $scope.CurrentPage * $scope.itemsPerPage;
          for (j = beginVal; j < endVal; j++) {
            $scope.dataToBeDisplayed.push($scope.subData[j]);
          }
        }
      }
    }

    //get all categories from JSON feed into an array
    function getCategories() {
      var b, c, d, newCatObj, noOfCat = 0, categoriesinJson = [];
      for (b in $scope.data) {
        if ($scope.data.hasOwnProperty(b)) {
          for (c in $scope.data[b].categories) {
            if ($scope.data[b].categories.hasOwnProperty(c)) {
              if (categoriesinJson.indexOf($scope.data[b].categories[c]) < 0) {
                //if the dategory does not exist in the array, add it to the list
                noOfCat++;
                categoriesinJson.push($scope.data[b].categories[c]);
              }
            }
          }
        }
      }

      for (d in categoriesinJson) {
        if (categoriesinJson.hasOwnProperty(d)) {
          newCatObj = {
            "value": parseInt(d, 10) + 1,
            "text": categoriesinJson[d]
          };
          $scope.categories.push(newCatObj);
        }
      }
    }

    //function to load the favorited videos
    function loadFavorites() {
      var i, j;
      if (localStorage.Favorites !== undefined) {
        var ls = JSON.parse(localStorage.Favorites);
        for (i in ls) {
          if (ls.hasOwnProperty(i)) {
            for (j in $scope.subData) {
              if ($scope.subData.hasOwnProperty(j)) {
                if (ls[i] === $scope.subData[j].title) {
                  $scope.subData[j].categories.push('Favorites');
                }
              }
            }
          }
        }

        $scope.categories.push({
          "value": $scope.categories.length,
          "text": "Favorites"
        });

        $scope.selected = $scope.categories.length - 1;
      }
    }

    //event listener for category filter
    $scope.$watch('selected', function () {
      changeContentByCategory();
    });

    //event listener for page change
    $scope.$watch('CurrentPage', function () {
      changeContentByPage();
    });

    LoadJson.success(function (data) {
      $scope.data = data;
      $scope.dataToBeDisplayed = [];
      $scope.subData = $scope.data;
      getCategories();
      loadFavorites();
      changeContentByCategory();
    });

  }]);