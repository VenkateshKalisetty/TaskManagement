var app = angular.module("taskApp", ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            url: 'login',
            templateUrl: 'login.html',
            controller: 'userLogin'
        })
        .when('/register', {
            url: 'register',
            templateUrl: 'register.html',
            controller: 'userRegistration'
        })
        .when('/forgotpassword', {
            url: 'forgotpassword',
            templateUrl: 'forgot.html',
            controller: 'forgotpasswordCtrl'
        })
        .when('/logout', {
            url: 'logout',
            templateUrl: 'login.html',
            controller: 'logoutCtrl'
        })
        // Lead Pages Routing
        .when('/lead', {
            url: 'lead',
            templateUrl: 'Lead/lead.html',
            controller: 'leadCtrl'
        })
        .when('/leadAssign', {
            url: 'leadAssign',
            templateUrl: 'Lead/leadAssign.html',
            controller: 'leadAssignCtrl'
        })
        .when('/leadProfile', {
            url: 'leadProfile',
            templateUrl: 'Lead/leadProfile.html',
            controller: 'leadProfileCtrl'
        })
        .when('/leadSelect', {
            url: 'leadSelect',
            templateUrl: 'Lead/leadSelect.html',
            controller: 'leadSelectCtrl'
        })
        .when('/leadTaskDetails', {
            url: 'leadTaskDetails',
            templateUrl: 'Lead/leadTaskDetails.html',
            controller: 'leadTaskDetailsCtrl'
        })
        // Resource Pages Routing
        .when('/resource', {
            url: 'resource',
            templateUrl: 'Resource/resource.html',
            controller: 'resourceCtrl'
        })
        .when('/resourceProfile', {
            url: 'resourceProfile',
            templateUrl: 'Resource/resourceProfile.html',
            controller: 'resourceProfileCtrl'
        })
        .when('/resourceTaskDetails', {
            url: 'resourceTaskDetails',
            templateUrl: 'Resource/resourceTaskDetails.html',
            controller: 'resourceTaskDetailsCtrl'
        })
        // Manager Pages Routing
        .when('/manager', {
            url: 'manager',
            templateUrl: 'Manager/manager.html',
            controller: 'managerCtrl'
        })
        .when('/assignProject', {
            url: 'assignProject',
            templateUrl: 'Manager/assignProject.html',
            controller: 'assignProjectCtrl'
        })
        .when('/managerProjectDetails', {
            url: 'managerProjectDetails',
            templateUrl: 'Manager/managerProjectDetails.html',
            controller: 'managerProjectDetailsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
})
