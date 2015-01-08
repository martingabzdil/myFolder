angular.module('displayArticles',[])

.controller('displayArticles', ['$scope', 'LoadJson',function($scope, LoadJson, CurrentPage) {
            //$scope functions called from DOM

            //function to convert timestamp from json
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

            //function to filter the content by category
            $scope.filterByCategory = function(selectedParam) {
                    $scope.selected = selectedParam;
                };

            //function to set the star icon depending on the favorites tag
            $scope.setFavIcon = function() {
                if (this.video.categories.indexOf('Favorites') > -1) {
                    return '_img/favActive.png';
                } else {
                     return '_img/favInactive.png';
                }
            };

            //function to ADD or REMOVE  the video into / from  favorites
            $scope.toFavorites = function() {
                if (localStorage['Favorites'] === undefined) {
                    localStorage['Favorites'] = '[]';
                }

                if ($scope.categories[$scope.categories.length - 1].text !== 'Favorites') {
                    var newCatObj = {
                        "value": parseInt($scope.categories.length),
                        "text": 'Favorites'
                    }
                    $scope.categories.push(newCatObj);
                }

                if (this.video.categories.indexOf('Favorites') > -1) {
                    //remove from favorites
                    this.video.categories.splice(this.video.categories.indexOf('Favorites'), 1);
                    var ls = JSON.parse(localStorage['Favorites']);
                    ls.splice(ls.indexOf(this.video.title), 1);
                    localStorage['Favorites'] = JSON.stringify(ls);
                } else {
                    //add to favorites
                    this.video.categories.push('Favorites');
                    var ls = JSON.parse(localStorage['Favorites']);
                    ls.push(this.video.title);
                    localStorage['Favorites'] = JSON.stringify(ls);

                }
            };
            
            //functions called from inside the controller

            function changeContentByCategory(){
                $scope.dataToBeDisplayed = [];
                $scope.subData = [];
                if ($scope.selected === 0) {
                    $scope.subData = $scope.data;
                } else {
                    for (var k in $scope.data) {
                        if ($scope.data[k].categories.indexOf($scope.categories[$scope.selected].text) > -1) {
                            $scope.subData.push($scope.data[k]);
                        }
                    }
                }
                if($scope.subData !== undefined){
                    if ($scope.subData.length < $scope.itemsPerPage) {
                        for (var j = 0; j < $scope.subData.length; j++) {
                            $scope.dataToBeDisplayed.push($scope.subData[j]);
                        }
                    } else {
                        for (var j = 0; j < 10; j++) {
                            $scope.dataToBeDisplayed.push($scope.subData[j]);
                        }
                    }
                }

                $scope.CurrentPage = 0;

            };

            function changeContentByPage(){
                $scope.dataToBeDisplayed = [];
                var beginVal = parseInt(0, 10);
                var endVal = parseInt(0, 10);

                if($scope.subData !== undefined){

                    if ($scope.subData.length % $scope.itemsPerPage !== 0 && $scope.CurrentPage === Math.floor($scope.subData.length / $scope.itemsPerPage)) {
                        endVal = $scope.subData.length;
                    } else endVal = ($scope.CurrentPage + 1) * $scope.itemsPerPage;
                    if ($scope.wHeight < 690) {
                        beginVal = 0;
                        endVal = ($scope.CurrentPage + 1) * $scope.itemsPerPage;
                        for (var j = beginVal; j < endVal; j++) {
                          $scope.dataToBeDisplayed.push($scope.subData[j]);
                        }
                    } else {
                        beginVal = $scope.CurrentPage * $scope.itemsPerPage;
                        for (var j = beginVal; j < endVal; j++) {
                          $scope.dataToBeDisplayed.push($scope.subData[j]);
                        }
                    }
                }
            };

            //get all categories from JSON feed into an array
            function getCategories(){
                var categoriesinJson = [];
                var noOfCat = 0;
                for (var b in $scope.data) {
                    for (var c in $scope.data[b].categories) {
                        if (categoriesinJson.indexOf($scope.data[b].categories[c]) > -1) {
                            //if the dategory exists in the array already do nothing
                        } else {
                            //if the dategory does not exist in the array, then add it
                            noOfCat++;
                            categoriesinJson.push($scope.data[b].categories[c]);
                        }

                    }
                }

                for (var d in categoriesinJson) {
                    var newCatObj = {
                        "value": parseInt(d) + 1,
                        "text": categoriesinJson[d]
                    }
                    $scope.categories.push(newCatObj);
                }
            };

            //function to load the favorited videos
            function loadFavorites(){
                if (localStorage['Favorites'] !== undefined) {
                    var ls = JSON.parse(localStorage['Favorites']);
                    for (var i in ls) {
                        for (var j in $scope.subData) {
                            if (ls[i] === $scope.subData[j].title) {
                                $scope.subData[j].categories.push('Favorites');
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
            $scope.$watch('selected', function() {
                changeContentByCategory();
            });

            //event listener for page change
            $scope.$watch('CurrentPage', function() {
               changeContentByPage();
            });

            LoadJson.success(function(data) {
                $scope.data = data;
                $scope.dataToBeDisplayed = [];
                $scope.subData = $scope.data;
                
                getCategories();
                loadFavorites();
            });

        }
    ]);