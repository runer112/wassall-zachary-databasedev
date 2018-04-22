(function () {
    angular
        .module("ProximiT")
        .controller("profileController", profileController);

    function profileController($rootScope, $location, $routeParams, userService, departureService) {
        var model = this;

        model.updateUser = updateUser;
        model.deleteUser = deleteUser;
        model.findDepartures = findDepartures;
        model.unfavorite = unfavorite;
        model.unfriendUser = unfriendUser;
        model.toggleFriendUser = toggleFriendUser;

        init();

        function init() {
            model.userId = $routeParams.userId;

            userService.findUserById(model.userId)
                .then(function (response) {
                    model.user = response.data;

                    if (model.user._id === $rootScope.user._id) {
                        $rootScope.title = "Profile";
                    } else {
                        $rootScope.title = (model.user.displayName ? model.user.displayName : model.user.username)
                            + "'s Profile";
                    }

                    updateFriendButton();
                    findDepartures();
                });
        }

        function updateUser() {
            model.successMessage = null;
            model.errorMessage = null;
            userService.updateUser(model.userId, model.user)
                .then(function (response) {
                    model.successMessage = "Changes saved successfully.";
                    if (model.user._id === $rootScope.user._id) {
                        $rootScope.user = model.user;
                    }
                }, function (response) {
                    model.errorMessage = response.data;
                });
        }

        function deleteUser() {
            userService.deleteUser(model.userId)
                .then(function (response) {
                    $location.url("/admin/users");
                });
        }

        function findDepartures() {
            var allowed = $rootScope.user && (model.user._id === $rootScope.user._id || model.user.friends.find(function (user) {
                return user._id === $rootScope.user._id;
            }));

            if (allowed) {
                departureService.findDeparturesForUser(model.user._id)
                    .then(function (response) {
                        model.favoriteDepartures = response.data;
                    });
            }

            return allowed;
        }

        function unfavorite(index) {
            model.favoriteDepartures.splice(index, 1);
            model.user.favorites.splice(index, 1);
            userService.updateUser(model.user._id, model.user)
                .then(function (response) {
                    // do nothing
                });
        }

        function unfriendUser(userId) {
            var index = model.user.friends.indexOf(userId);
            model.user.friends.splice(index, 1);
            userService.updateUser(model.user._id, model.user)
                .then(function (response) {
                    // do nothing
                });
        }

        function toggleFriendUser() {
            if (isFriend()) {
                var index = $rootScope.user.friends.indexOf(model.userId);
                $rootScope.user.friends.splice(index, 1);
            } else {
                $rootScope.user.friends.push(model.userId);
            }
            userService.updateUser($rootScope.user._id, $rootScope.user)
                .then(function (response) {
                    updateFriendButton();
                });
        }

        function updateFriendButton() {
            model.friendButtonText = isFriend() ? "Unfriend" : "Friend";
        }

        function isFriend() {
            return $rootScope.user && $rootScope.user.friends.includes(model.userId);
        }
    }
})();
