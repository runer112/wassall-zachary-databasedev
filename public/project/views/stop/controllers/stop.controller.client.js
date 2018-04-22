(function () {
    angular
        .module("ProximiT")
        .controller("stopController", stopController);

    function stopController($rootScope, $routeParams, $location, $sce, stopService, routeService, alertService, departureService, userService) {
        var model = this;

        model.setDirection = setDirection;
        model.getMapSrc = getMapSrc;
        model.toggleFavorite = toggleFavorite;
        model.deleteRouteAlert = deleteRouteAlert;

        init();

        function init() {
            delete model.stopObj;
            delete model.departures;

            model.routeId = $routeParams.routeId;

            if (model.route && model.route.id === model.routeId) {
                initAfterRoute();
            } else {
                routeService.findRouteById(model.routeId)
                    .then(function (response) {
                        model.route = response.data;
                        initAfterRoute();
                    });
            }

            alertService.findAlertsForRoute(model.routeId)
                .then(function (response) {
                    model.alerts = response.data;
                })
        }

        function initAfterRoute() {
            model.stopId = $routeParams.stopId;
            model.stopObj = {
                routeId: model.routeId,
                direction: model.direction,
                stopId: model.stopId,
            };

            setDirection($location.search().direction);
        }

        function findDepartures() {
            delete model.departures;

            departureService.findDeparturesForStopOnRoute(model.routeId, model.stopId, model.direction)
                .then(function (response) {
                    model.departures = response.data;
                });
        }

        function setDirection(direction) {
            model.direction = direction == 1 ? 1 : 0;

            if (model.route) {
                var routeName = model.route.attributes.long_name
                model.directionName = model.route.attributes.direction_names[model.direction];
                $rootScope.title = "Stops - " + routeName + " (" + model.directionName + ")";
            }

            updateFavoriteButton();

            if (isStopLoaded()) {
                findDepartures();
            } else {
                stopService.findStopById(model.stopId)
                    .then(function (response) {
                        model.stop = response.data;
                        findDepartures();
                    });
            }
        }

        function getMapSrc() {
            if (isStopLoaded()) {
                var url = "https://www.google.com/maps/embed/v1/view"
                    + "?key=AIzaSyDBh9f6AjIHPiWCTJ_8yAIHCGA0qayiATE"
                    + "&center=" + model.stop.attributes.latitude + "," + model.stop.attributes.longitude
                    + "&zoom=17";
                return $sce.trustAsResourceUrl(url);
            }
        }

        function isStopLoaded() {
            return model.stop && model.stop.id == model.stopId;
        }

        function toggleFavorite() {
            var index = getFavoriteIndex();
            if (index >= 0) {
                $rootScope.user.favorites.splice(index, 1);
            } else {
                $rootScope.user.favorites.push(getFavoriteObj());
            }
            userService.updateUser($rootScope.user._id, $rootScope.user)
                .then(function (response) {
                    updateFavoriteButton();
                });
        }

        function updateFavoriteButton() {
            model.favoriteButtonText = getFavoriteIndex() >= 0 ? "Unfavorite" : "Favorite";
        }

        function getFavoriteIndex() {
            if (!$rootScope.user) {
                return -1;
            }

            var favorites = $rootScope.user.favorites;
            for (var i = 0; i < favorites.length; i++) {
                var favorite = favorites[i];
                if (favorite.routeId === model.routeId && favorite.direction === model.direction && favorite.stopId === model.stopId) {
                    return i;
                }
            }

            return -1;
        }

        function getFavoriteObj() {
            return {
                routeId: model.routeId,
                direction: model.direction,
                stopId: model.stopId
            };
        }

        function deleteRouteAlert(index) {
            alertService.deleteRouteAlert(model.alerts[index]._id)
                .then(function (response) {
                    model.alerts.splice(index, 1);
                });
        }
    }
})();
