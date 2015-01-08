angular.module('loader',[])

.factory('LoadJson', ['$http',
        function($http) {

            return $http.get('http://academy.tutoky.com/api/json.php');
        }
]);