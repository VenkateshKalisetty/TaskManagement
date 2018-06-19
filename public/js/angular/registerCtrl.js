//###################### Registration Controller ###############################
// Register Controller
app.controller('userRegistration', function ($scope, $http, $location) {
    $scope.userReg = function () {
        var regData = {
            "name":$scope.name,
            "gender":$scope.gender,
            "empid":$scope.empid,
            "contact":$scope.contact,
            "position":$scope.position,
            "skills":$scope.skills,
            "about":$scope.about,
            "email": $scope.email,
            "password": $scope.password
        }
        //alert(JSON.stringify(regData));
        $http.post('http://localhost:8080/signup', regData).then(function (response) {
            if (response.data.output.length != 0) {
                Materialize.toast("Register Successfully...!!!",4000);
                $location.path('/login');
            } else {
                Materialize.toast("Oops...Try again...!!!",4000);
            }
        })
    }
})