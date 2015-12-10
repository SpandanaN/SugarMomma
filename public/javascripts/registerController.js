var register = {} ;

window.onload = registerCityCountry;

function registerCityCountry(){





    console.log('1');
    var input = document.getElementById('cityCountrySelect');
    var options = {
        types: ['(regions)']
    };

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    console.log('2');

    autocomplete.addListener('place_changed',function(){
        console.log('3');
        //returns the location autocompleted in the input field
        var result = autocomplete.getPlace();
        register.location = result.formatted_address ;
        console.log(result.formatted_address);
        //lat and lng are extracted
        var lat = result.geometry.location.lat();
        var lng = result.geometry.location.lng();

        // use the address_components to get the city,state,country etc.........
        console.log(result.address_components);

        var locObject = {lat:lat , lng:lng};
        console.log(JSON.stringify(locObject));

        register.latlng = locObject;
        register.location = result.formatted_address;
//           register.city = result.address_components[0].long_name;
//           register.country = result.address_components[3].long_name;

        // localStorage.setItem('userEntry',JSON.stringify(locObject) );

    });


}



var app = angular.module('regForm',[]);

app.controller('formController',['$scope','$http','$window', function($scope,$http,$window) {


    $scope.minValue = 4 ;
    $scope.testValue = 10;
    $scope.location =  register.location;
    $scope.verifyForm = function(){

        console.log('user info')
        console.log($scope.user);
        console.log(!$scope.firstHalf.$invalid);
        $scope.invalid = $scope.firstHalf.$invalid;
        //if the first four fields are filled
        if(!$scope.firstHalf.$invalid) {
            // adding attributes to user object
            $scope.user.latlng = register.latlng;
            $scope.user.location = register.location ;
//                        $scope.user.city = register.city;
//                        $scope.user.country = register.country;
            console.log($scope.user);
            $http.post('/signup',$scope.user).success(function(res){
                    console.log(res);
                    $scope.response={};
                    // used to display message in HTML
                    $scope.response.emailAlreadyExists = res.emailAlreadyExists ;
                    $scope.response.emailValid = res.emailValid ;
                    console.log('scope.response is :---'+$scope.response.emailAlreadyExists);
                    // if res is true redirect to login page
                    if((res.emailAlreadyExists === 'false') && (res.emailValid === 'true')) {
                        console.log('entered true');
                        $scope.response.formAccepted = 'true';
                        // clear all text from inputs after sucessful submission only
                        $scope.user = null ;
                        $scope.location = null ;
                        $window.location.href = '/myProfile' ;
                    }else{
                        $scope.response.formAccepted = 'false';
                    }
                }
            );
            console.log('valid form');
        }


    };

    $scope.credCheck = function(){
        console.log('entered');
        if($scope.cred.username==="snamburu@scu.edu" & $scope.cred.password==="As3"){
            $window.location.href = '/admin' ;
        }
        else {
            $http.post('/cred', $scope.cred).success(function (res) {
                console.log('success' + "---" + res.match + "---" + res.error);

                $scope.match = res.match;
                if (res.match === 1) {
                    $window.location.href = '/myProfile';
                }
            });
        }

    };



}]);
