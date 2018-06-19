//########################### Lead regarding Controllers ##########################################
// Lead Select Resource
app.controller('leadSelectCtrl', function ($scope, $http, $window, $location) {
    $http.get("http://localhost:8080/resourceData").then(function (response) {
        $scope.resourceSelect = response.data.output;
    });
    var user = $window.localStorage.getItem('user');
    var u = JSON.parse(user);
    $scope.chooseRes = function (email) {
        var resdata = {
            "email": email,
            "project": u.project
        }
        $http.post('http://localhost:8080/selectResource', resdata).then(function (response) {
            if (response.data.output.length != 0) {
                Materialize.toast("Resource selected successfully...!!!",4000);
                $location.path('/leadTaskDetails');
            } else {
                Materialize.toast("Oops...Resource not selected",4000);
            }
        })
    }
})
//Lead Home Page Details
app.controller('leadCtrl', function ($scope, $http, $filter, $window) {
    $http.get("http://localhost:8080/leadProfile").then(function (response) {
        var resp = response.data.output;
        var user = $window.localStorage.getItem('user');
        var u = JSON.parse(user);
        var profile = $filter('filter')(resp, {
            email: u.email
        })[0];
        $scope.leadProfile = profile;
    });
})
//Lead Profiles Details
app.controller('leadProfileCtrl', function ($scope, $http, $filter, $window) {
    $http.get("http://localhost:8080/leadProfile").then(function (response) {
        var resp = response.data.output;
        var user = $window.localStorage.getItem('user');
        var u = JSON.parse(user);
        var profile = $filter('filter')(resp, {
            email: u.email
        })[0];
        $scope.leadProfile = profile;
    });
})
//Lead Assign Task to resource
app.controller('leadAssignCtrl', function ($scope, $http, $filter, $window, $location) {
    var user = $window.localStorage.getItem('user');
    var u = JSON.parse(user);
    $http.get("http://localhost:8080/leadAssign").then(function (response) {
        var resp = response.data.output;
        $scope.resProject = u.project;
        //var resource = $filter('filter')(resp,{project:u.project})[0];
        $scope.leadAssignDetails = resp;
    });
    $scope.assignTask = function () {
        var taskDetails = {
            "email": $scope.filter.email,
            "project": u.project,
            "task": $scope.resourceTask,
            "assignby": u.name
        }

        $http.post('http://localhost:8080/assignTask', taskDetails).then(function (response) {
            if (response.data.output.length != 0) {
                Materialize.toast(response.data.message, 4000);
                $location.path('/leadTaskDetails');
            } else {
                Materialize.toast("Oops...Task not assigned...!!!",4000)
            }
        })
    }
})
//Lead Task Details
app.controller('leadTaskDetailsCtrl', function ($scope, $http, $filter, $window) {
    $http.get("http://localhost:8080/leadTaskDetails").then(function (response) {
        var resp = response.data.output;
        var user = $window.localStorage.getItem('user');
        var u = JSON.parse(user);
        $scope.leadProject = u.project;
        $scope.resProfile = resp;
    });
})
