(function () {
    angular
        .module("ProximiT")
        .controller("searchController", searchController);

    function searchController($rootScope, $routeParams, $location, stopService) {
        var model = this;

        model.search = search;

        init();

        function init() {
            $rootScope.title = "Stops";

            stopService.findStops()
                .then(function (response) {
                    model.allStops = response.data;
                    model.q = $routeParams.q;

                    doSearch(model.q);
                });
        }

        function search() {
            $location.url("/stop?q=" + model.q);
        }

        function doSearch(q) {
            model.stops = [];

            if (model.allStops && q) {
                if (q.length >= 2) {
                    q = q.toLowerCase();
                    model.stops = model.allStops.filter(function (stop) {
                        return stop.attributes.name.toLowerCase().indexOf(q) >= 0;
                    });

                    if (!model.stops.length) {
                        model.errorMessage = "No results found.";
                    }

                } else {
                    model.errorMessage = "Search string too short.";
                }
            }
        }
    }
})();
