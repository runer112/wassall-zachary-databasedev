(function () {
    angular
        .module("ProximiT")
        .controller("stopRouteListController", stopRouteListController);

    function stopRouteListController($rootScope, $routeParams, routeService, stopService) {
        var model = this;

        init();

        function init() {
            model.stopId = $routeParams.stopId;

            if (!model.stop || model.stop.id !== model.stopId) {
                stopService.findStopById(model.stopId)
                    .then(function (response) {
                        model.stop = response.data;
                    });
            }

            routeService.findRoutesForStop(model.stopId)
                .then(function (response) {
                    model.routes = response.data;
                });
        }
    }
})();
