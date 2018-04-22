(function () {
    angular
        .module("ProximiT")
        .factory("stopService", stopService);

    function stopService($http) {
        var api = {
            findStops: findStops,
            findStopsOnRoute: findStopsOnRoute,
            findStopById: findStopById,
        };

        return api;

        function getBaseUrl() {
            return "/p/api/stop";
        }

        function getEntityUrl(stopId) {
            return getBaseUrl() + "/" + stopId;
        }

        function findStops() {
            return $http.get(getBaseUrl());
        }

        function findStopsOnRoute(routeId, direction) {
            return $http.get("/p/api/route/" + routeId + "/stop", {
                params: { direction: direction }
            });
        }

        function findStopById(stopId) {
            return $http.get(getEntityUrl( stopId));
        }
    }
})();
