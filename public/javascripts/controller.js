(function(){
    var app=angular.module('userProfile',['ngFileUpload']);

    app.controller('PostController',['$scope','$http','Upload', '$timeout','$q',function($scope,$http,Upload,$timeout,$q){


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

        $http.get('/cookie').success(function(response){
            $scope.user=response;
            console.log(response.email);
            $scope.imagePath=response.dp_src;

        });

        $scope.increaseLike=function(id){
            $scope.posts[id].likes+=1;
           // console.log($scope.posts[id].likes);
        };

        $scope.update=function(id){
            console.log(id);

            $http.put('/posts/'+id).success(function(){
               console.log("successful");

            });

            refresh();

        };

        $scope.getUserProfile=function(id) {

            $http.get('/UserDetails/'+id).success(function(response){
               $scope.userProfile=response;
                console.log(response);
            });

        };

        $scope.postMessage=function() {
            console.log($scope.postmessage);
            console.log("post outside");

            $http.post('/posts',$scope.postmessage).success(function (response) {
                console.log("post inside");
                console.log(response);
                $scope.postmessage="";
            });
            refresh();
        };

        $scope.submitComment=function(id,comment){
            console.log(id);
            console.log(comment);
            $http.post("/posts/"+id,comment).success(function(){
            refresh();
            console.log("comment submitted");
            });
        };

        $scope.changePassword=function(){
            $http.put('/changePassword',$scope.pass).success(function(response){
                console.log("Password changed");
                $scope.pass.oldPassword="";
                $scope.pass.newPassword="";
                console.log(response);
                if(response==="no match"){
                    $scope.invalidPassword=true;
                    $scope.passwordSaved=false;
                }
                else{
                    $scope.passwordSaved=true;
                    $scope.invalidPassword=false;
                }
            });
        };


        $scope.uploadFiles = function(file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        console.log(response.data+'changing the imagePath variables');
                        $scope.imagePath = response.data;

                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        }



    }]);

})();