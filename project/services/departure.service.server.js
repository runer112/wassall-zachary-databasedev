var $q = require('q');

module.exports = function (app, services) {
    var baseUrl = "/p/api/route/:routeId/stop/:stopId/departure";
    var routeIdParam = "routeId";
    var stopIdParam = "stopId";

    // http handlers
    app.get(baseUrl, efindForStopOnRoute);
    app.get("/p/api/user/:userId/departure", efindForUser);
    var userIdParam = "userId";

    var api = {
        findForStopOnRoute: findForStopOnRoute,
        findForUser: findForUser,
    };

    return api;

    // express API

    function esend(res, promise) {
        promise
            .then(function (data) {
                if (data) {
                    res.json(data);
                } else {
                    res.sendStatus(404);
                }
            });
    }

    function efindForStopOnRoute(req, res) {
        var routeId = req.params[routeIdParam];
        var stopId = req.params[stopIdParam];
        var query = req.query;
        var promise = api.findForStopOnRoute(routeId, stopId, query);
        esend(res, promise);
    }

    function efindForUser(req, res) {
        var userId = req.params[userIdParam];
        var promise = api.findForUser(userId);
        esend(res, promise);
    }

    // API

    function findForStopOnRoute(routeId, stopId, query) {
        var deferred = $q.defer();

        var direction = Number.parseInt(query.direction);

        if (direction === 0 || direction === 1) {
            services.mbtaService.get({
                url: "https://api-v3.mbta.com/predictions",
                qs: {
                    "filter[route]": routeId,
                    "filter[direction_id]": direction,
                    "filter[stop]": stopId,
                    "sort": "departure_time"
                }
            }).then(function (departures) {
                var limit = query.limit ? query.limit : 5;
                var validDepartures = [];

                for (var i = 0; i < departures.length; i++) {
                    if (validDepartures.length == limit) {
                        break;
                    }

                    var departure = departures[i];

                    if (departure.attributes.departure_time) {
                        validDepartures.push(departure);
                    }
                }

                deferred.resolve(validDepartures);
            });
        } else {
            deferred.reject("Invalid direction");
        }

        return deferred.promise;
    }

    function findForUser(userId) {
        var deferred = $q.defer();

        var routes = null;
        var stops = null;
        var favorites = null;
        var stopDepartures = [];
        var stopDeparturesFetched = 0;

        var checkDone = function () {
            if (routes && stops && favorites && stopDeparturesFetched === favorites.length) {
                var routesById = byId(routes);
                var stopsById = byId(stops);

                var result = stopDepartures.map(function (departures, i) {
                    var favorite = favorites[i];
                    return {
                        route: routesById[favorite.routeId],
                        direction: favorite.direction,
                        stop: stopsById[favorite.stopId],
                        departures: departures
                    }
                });

                deferred.resolve(result);
            }
        };

        services.userService.findByIdNoPopulate(userId)
            .then(function (user) {
                if (!user) {
                    deferred.resolve([]);
                    return;
                }

                favorites = user.favorites;

                if (!favorites.length) {
                    deferred.resolve([]);
                    return;
                }

                services.routeService.find()
                    .then(function (routes_) {
                        routes = routes_;
                        checkDone();
                    });

                services.stopService.find()
                    .then(function (stops_) {
                        stops = stops_;
                        checkDone();
                    });

                favorites.forEach(function (favorite, i) {
                    findForStopOnRoute(favorite.routeId, favorite.stopId, {
                        direction: favorite.direction,
                        limit: 3
                    }).then(function (departures) {
                        stopDepartures[i] = departures;
                        stopDeparturesFetched++;
                        checkDone();
                    });
                });
            });

        return deferred.promise;
    }

    // internal

    function byId(array) {
        var result = {};
        array.forEach(function (x) {
            result[x.id] = x;
        });
        return result;
    }
};
