(function () {
    angular
        .module("ProximiT")
        .factory("departureService", departureService);

    function departureService($http) {
        var api = {
            findDeparturesForStopOnRoute: findDeparturesForStopOnRoute,
            findDeparturesForUser: findDeparturesForUser,
        };

        return api;

        function getBaseUrl(routeId, stopId) {
            return "/p/api/route/" + routeId + "/stop";
        }

        function getEntityUrl(routeId, stopId) {
            return getBaseUrl(routeId) + "/" + stopId;
        }

        function findDeparturesForStopOnRoute(routeId, stopId, direction) {
            return $http.get("/p/api/route/" + routeId + "/stop/" + stopId + "/departure", {
                params: { direction: direction }
            });
        }

        function findDeparturesForUser(userId) {
            return $http.get("/p/api/user/" + userId + "/departure");
        }
    }
})();
