(function() {
    var app = angular.module('adminProfile', []);

    app.controller('adminController', ['$scope', '$http', function ($scope, $http) {

        var refresh=function(){
            $http.get('/posts').success(function(response){
                $scope.posts=response;
                $scope.postmessage="";
                $scope.comment="";

            });

        };



        $http.get('/posts').success(function(response){
            console.log("this is from controller");
            $scope.posts=response;
            $scope.postmessage="";
            $scope.comment="";
            // console.log(response);
        });

        $scope.getUserProfile=function(id) {

            $http.get('/UserDetails/'+id).success(function(response){
                $scope.userProfile=response;
                console.log(response);
            });

        };

        $scope.removeUser=function(){
            $http.delete('/user/'+$scope.userEmail).success(function(response){
                console.log(response);
                $scope.userEmail="";
            });
        };

        $scope.removePost=function(id){
            $http.delete('/post/'+id).success(function(response){
                console.log(response);
                refresh();
            });
        };


    }]);
})();