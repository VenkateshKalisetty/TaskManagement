//###################### Manager regarding Controllers ##################################################
app.controller('managerCtrl', function ($scope, $http, $location, $filter, $window) {
    $http.get("http://localhost:8080/managerProfile").then(function (response) {
        var resp = response.data.output;
        var user = $window.localStorage.getItem('user');
        var u = JSON.parse(user);
        var profile = $filter('filter')(resp, {
            email: u.email
        })[0];
        $scope.managerProfile = profile;
    });
})
app.controller('managerProjectDetailsCtrl', function ($scope, $http, $filter, $window) {
    $http.get("http://localhost:8080/projectDetails").then(function (response) {
        var resp = response.data.output;
        $scope.projectDetails = resp;
    });
})
app.controller('assignProjectCtrl', function ($scope, $http, $location, $filter, $window) {

})
