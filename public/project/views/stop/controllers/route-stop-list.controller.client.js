(function () {
    angular
        .module("ProximiT")
        .controller("routeStopListController", routeStopListController);

    function routeStopListController($rootScope, $routeParams, $location, $route, stopService, routeService, alertService) {
        var model = this;

        model.setDirection = setDirection;
        model.createRouteAlert = createRouteAlert;
        model.deleteRouteAlert = deleteRouteAlert;

        init();

        function init() {
            model.routeId = $routeParams.routeId;
            setDirection($location.search().direction);
            model.alert = {};

            if (model.route && model.route.id === model.routeId) {
                applyDirection();
            } else {
                routeService.findRouteById(model.routeId)
                    .then(function (response) {
                        model.route = response.data;
                        applyDirection();
                    });
            }

            alertService.findAlertsForRoute(model.routeId)
                .then(function (response) {
                    model.alerts = response.data;
                })
        }

        function setDirection(direction) {
            setDirectionNoReload(direction);

            stopService.findStopsOnRoute(model.routeId, model.direction)
                .then(function (response) {
                    model.stops = response.data;
                });
        }

        function setDirectionNoReload(direction) {
            model.direction = direction == 1 ? 1 : 0;
            applyDirection();
        }

        function applyDirection() {
            if (model.route) {
                var routeName = model.route.attributes.long_name;
                model.directionName = model.route.attributes.direction_names[model.direction];
                $rootScope.title = routeName + " (" + model.directionName + ") - Stops";
            }
        }

        function createRouteAlert() {
            model.alert.routeId = model.routeId;
            model.alert.updatedBy = $rootScope.user;

            model.errorMessage = null;
            alertService.createRouteAlert(null, model.alert)
                .then(function (response) {
                    $route.reload();
                }, function (response) {
                    model.errorMessage = response.data;
                });
        }

        function deleteRouteAlert(index) {
            alertService.deleteRouteAlert(model.alerts[index]._id)
                .then(function (response) {
                    model.alerts.splice(index, 1);
                });
        }
    }
})();
