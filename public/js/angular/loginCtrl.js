//###################### Login and Logout regarding Controllers ###############################
// Login Controller
app.controller('userLogin', function ($scope, $http, $location, $window) {
    $scope.userLog = function () {
        var loginData = {
            "email": $scope.email,
            "password": $scope.password
        }
        //alert(JSON.stringify(loginData));
        $http.post('http://localhost:8080/signin', loginData).then(function (response) {
            if (response.data.output == "success") {
                $window.localStorage.setItem('user', JSON.stringify(response.data.user));
                Materialize.toast("Welcome..!! " + response.data.name, 4000);
                if (response.data.position == "Lead") {
                    $location.path('/lead');
                } else if (response.data.position == "Resource") {
                    $location.path('/resource');
                } else {
                    $location.path('/manager');
                }
            } else {
                Materialize.toast(response.data.message, 4000);
            }
        })
    }
})
// Logout Controller
app.controller('logoutCtrl', function ($scope, $window, $location) {
    $window.localStorage.removeItem('user');
    Materialize.toast("Logout successfully...!!!", 3000)
    $location.path('/');
});
// Forgot password Controller
app.controller('forgotpasswordCtrl', function ($scope, $window, $location, $http) {
    $scope.forgotPasswd = function () {
        var forgotData = {
            "email": $scope.email
        }
        $http.post('http://localhost:8080/forgotpassword', forgotData).then(function (response) {
            if (response.data.output == "success") {
                Materialize.toast(response.data.message, 4000);
                $location.path('/login');
            } else {
                Materialize.toast(response.data.message, 4000);
            }
        })
    }
});
