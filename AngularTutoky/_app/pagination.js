angular.module('pagination',['loader'])

.controller('Pagination', ['$window', '$scope', 'LoadJson', function($window, $scope, LoadJson , CurrentPage) {
            LoadJson.success(function(data) {
                reloadNoOfPages();
            });

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
                } else {
                    if (btn === 1 || btn === (Math.floor($scope.subData.length / $scope.itemsPerPage) - oddVsEvenDecider - 1)) {
                        return '...';
                    } else {
                        return null;
                    }
                }

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

            function reloadNoOfPages() {
                $scope.noOfPages = [];
                if($scope.subData !== undefined){
                    for (var i = 0; i < ($scope.subData.length / $scope.itemsPerPage); i++) {
                        $scope.noOfPages.push(i);
                    }
                    
                }
            }
            
            $scope.$watch('CurrentPage', function() {
                    reloadNoOfPages();
                });

             $scope.$watch('selected', function() {
                    reloadNoOfPages();
                })
        }
    ]);