(function() {
    var app = angular.module('usersList', []);

    app.controller('UsersController', ['$scope', '$http', function ($scope, $http) {

        $http.get('/cookie').success(function(response){
            $scope.user=response;
        });

        $http.get('/users').success(function(response){
            $scope.users=response;
            console.log(response);
        });

        $scope.getUserDetails=function(id){
            $http.get('/userListProfile/'+id).success(function(response){
                $scope.userDetails=response;
            });
        };

    }]);
})();
