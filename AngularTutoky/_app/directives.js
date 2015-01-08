angular.module('directives',[])

.directive('videoElement', function() {
    return {
        restrict: 'E',
        templateUrl: './_tmp/templateArticles.html' //dynamic template for article rendering
    };
})

.directive('buttonElement', function() {
    return {
        restrict: 'E',
        templateUrl: '_tmp/templateButtons.html' //dynamic template for button rendering
    };
});