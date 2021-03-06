(function () {
    angular
        .module("ProximiT")
        .config(configuration)
        .run(function ($rootScope, $route, userService) {
            $rootScope.logout = function () {
                userService.logout()
                    .then(
                        function (response) {
                            $rootScope.user = null;
                            $route.reload();
                        });
            }
        });

    var getLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/p/api/loggedin')
            .then(function (response) {
                var user = response.data;
                $rootScope.user = user;
                deferred.resolve(user);
            });
        return deferred.promise;
    };

    var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/p/api/loggedin')
            .then(function (response) {
                var user = response.data;
                if (user) {
                    $rootScope.user = user;
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                    $location.url('/');
                }
            });
        return deferred.promise;
    };

    var checkNotLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/p/api/loggedin')
            .then(function (response) {
                var user = response.data;
                if (user) {
                    deferred.reject();
                    $location.url('/');
                } else {
                    $rootScope.user = user;
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    };

    var checkAdmin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/p/api/loggedin')
            .then(function (response) {
                var user = response.data;
                if (user && user.isAdmin) {
                    $rootScope.user = user;
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                    $location.url('/');
                }
            });
        return deferred.promise;
    };

    function configuration($routeProvider) {
        $routeProvider
        // home route
            .when("/", {
                templateUrl: "views/departure/templates/favorite-departures.view.client.html",
                controller: "favoriteDeparturesController",
                controllerAs: "model",
                resolve: {loggedin: getLoggedin}
            })
            // user routes
            .when("/login", {
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "loginController",
                controllerAs: "model",
                resolve: {loggedin: checkNotLoggedin}
            })
            .when("/register", {
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "registerController",
                controllerAs: "model",
                resolve: {loggedin: checkNotLoggedin}
            })
            .when("/profile/:userId", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "profileController",
                controllerAs: "model",
                resolve: {loggedin: getLoggedin}
            })
            .when("/admin/users", {
                templateUrl: "views/user/templates/user-list.view.client.html",
                controller: "userListController",
                controllerAs: "model",
                resolve: {loggedin: checkAdmin}
            })
            // route routes
            .when("/route", {
                templateUrl: "views/route/templates/route-list.view.client.html",
                controller: "routeListController",
                controllerAs: "model",
                resolve: {loggedin: getLoggedin}
            })
            .when("/stop/:stopId/route", {
                templateUrl: "views/route/templates/stop-route-list.view.client.html",
                controller: "stopRouteListController",
                controllerAs: "model",
                resolve: {loggedin: getLoggedin}
            })
            // stop routes
            .when("/route/:routeId/stop", {
                templateUrl: "views/stop/templates/route-stop-list.view.client.html",
                controller: "routeStopListController",
                controllerAs: "model",
                resolve: {loggedin: getLoggedin}
            })
            .when("/route/:routeId/stop/:stopId", {
                templateUrl: "views/stop/templates/stop.view.client.html",
                controller: "stopController",
                controllerAs: "model",
                resolve: {loggedin: getLoggedin}
            })
            .when("/stop", {
                templateUrl: "views/stop/templates/search.view.client.html",
                controller: "searchController",
                controllerAs: "model",
                resolve: {loggedin: getLoggedin}
            })
    }
})();