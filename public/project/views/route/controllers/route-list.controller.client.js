(function () {
    angular
        .module("ProximiT")
        .controller("routeListController", routeListController);

    function routeListController($rootScope, routeService) {
        var model = this;

        init();

        function init() {
            $rootScope.title = "Routes";

            routeService.findRoutes()
                .then(function (response) {
                    model.routes = response.data;
                });
        }
    }
})();
