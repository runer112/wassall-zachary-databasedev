(function () {
    angular
        .module("ProximiT")
        .factory("alertService", alertService);

    function alertService($http) {
        var genericService = createGenericService($http, getBaseUrl, getEntityUrl);

        var api = {
            createRouteAlert: genericService.create,
            findAlertsForRoute: genericService.queryBy("routeId"),
            deleteRouteAlert: genericService.delete,
        }

        return api;

        function getBaseUrl() {
            return "/p/api/alert";
        }

        function getEntityUrl(entityId) {
            return "/p/api/alert/" + entityId;
        }
    }
})();
