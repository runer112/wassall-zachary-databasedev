(function () {
    angular
        .module("ProximiT")
        .controller("favoriteDeparturesController", favoriteDeparturesController);

    function favoriteDeparturesController($rootScope, departureService) {
        var model = this;

        model.findDepartures = findDepartures;

        init();

        function init() {
            $rootScope.title = "Home";

            findDepartures();
        }

        function findDepartures() {
            if ($rootScope.user) {
                departureService.findDeparturesForUser($rootScope.user._id)
                    .then(function (response) {
                        model.favoriteDepartures = response.data;
                    });
            }
        }
    }
})();
