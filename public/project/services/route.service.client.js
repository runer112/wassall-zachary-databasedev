(function () {
    angular
        .module("ProximiT")
        .factory("routeService", routeService);

    function routeService($http) {
        var api = {
            findRoutes: findRoutes,
            findRoutesForStop: findRoutesForStop,
            findRouteById: findRouteById,
        };

        return api;

        function getBaseUrl() {
            return "/p/api/route";
        }

        function getEntityUrl(routeId) {
            return getBaseUrl() + "/" + routeId;
        }

        function findRoutes() {
            return $http.get(getBaseUrl());
        }

        function findRoutesForStop(stopId) {
            return $http.get("/p/api/stop/" + stopId + "/route");
        }

        function findRouteById(routeId) {
            return $http.get(getEntityUrl(routeId));
        }
    }
})();
