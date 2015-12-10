(function(){
    var app=angular.module('indexPage',[]);

    app.controller('indexController',['$scope','$http',function($scope,$http) {

        $scope.submitForm=function() {


            console.log($scope.contactDetails);
            $http.post('/sendContactEmail',$scope.contactDetails).success(function(response){
                console.log(response);
                $scope.contactDetails.username="";
                $scope.contactDetails.email="";
                $scope.contactDetails.city="";
                $scope.contactDetails.message="";
                $scope.message=response.message;
            });

        };
    }])
})();