//################################# Resource regarding Controllers ####################################
//Resource Profils Details
app.controller('resourceProfileCtrl', function ($scope, $http, $filter, $window) {
    $http.get("http://localhost:8080/resourceProfile").then(function (response) {
        var resp = response.data.output;
        var user = $window.localStorage.getItem('user');
        var u = JSON.parse(user);
        var profile = $filter('filter')(resp, {
            email: u.email
        })[0];
        $scope.resourceProfile = profile;
    });
})
//Resource Home Page
app.controller('resourceCtrl', function ($scope, $http, $filter, $window) {
    $http.get("http://localhost:8080/resourceProfile").then(function (response) {
        var resp = response.data.output;
        var user = $window.localStorage.getItem('user');
        var u = JSON.parse(user);
        var profile = $filter('filter')(resp, {
            email: u.email
        })[0];
        $scope.resourceProfile = profile;
    });
})
//Resource Task Details
app.controller('resourceTaskDetailsCtrl', function ($scope, $http, $filter, $window) {
    var user = $window.localStorage.getItem('user');
    var u = JSON.parse(user);
    $http.get("http://localhost:8080/resourceProfile").then(function (response) {
        var resp = response.data.output;
        var profile = $filter('filter')(resp, {
            email: u.email
        })[0];
        $scope.resourceProfile = profile;
        $scope.resourceStatus = profile.status;
        $scope.resourceComments = profile.comments;
    });
    $scope.taskUpdate = function () {
        var updateData = {
            "email": u.email,
            "project": u.project,
            "status": $scope.resourceStatus,
            "comments": $scope.resourceComments
        }
        $http.post('http://localhost:8080/resourceStatus', updateData).then(function (response) {
            if (response.data.output.length != 0) {
                Materialize.toast("Status Updated Successfully...!!!",4000);
            } else {
                Materialize.toast("Oops Not updated...!!!",4000);
            }
        })
    }
})
