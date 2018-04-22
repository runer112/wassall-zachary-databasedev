var $q = require('q');

module.exports = function (app, mbtaService) {
    var baseUrl = "/p/api/stop";
    var entityUrl = baseUrl + "/:stopId";
    var idParam = "stopId";

    // http handlers
    app.get(baseUrl, efind);
    app.get("/p/api/route/:routeId/stop", efindOnRoute);
    var routeIdParam = "routeId";
    app.get(entityUrl, efindById);

    var api = {
        find: find,
        findOnRoute: findOnRoute,
        findById: findById,
    };

    var stopCache;

    init();

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

    function efind(req, res) {
        var promise = api.find();
        esend(res, promise);
    }

    function efindOnRoute(req, res) {
        var routeId = req.params[routeIdParam];
        var query = req.query;
        var promise = api.findOnRoute(routeId, query);
        esend(res, promise);
    }

    function efindById(req, res) {
        var entityId = req.params[idParam];
        var promise = api.findById(entityId);
        esend(res, promise);
    }

    // API

    function find() {
        var deferred = $q.defer();
        deferred.resolve(stopCache);
        return deferred.promise;
    }

    function findOnRoute(routeId, query) {
        var deferred = $q.defer();

        var direction = Number.parseInt(query.direction);

        if (direction === 0 || direction === 1) {
            deferred.resolve(mbtaService.get({
                url: "https://api-v3.mbta.com/stops",
                qs: {
                    "filter[route]": routeId,
                    "filter[direction_id]": direction
                }
            }));
        } else {
            deferred.reject("Invalid direction");
        }

        return deferred.promise;
    }

    function findById(entityId) {
        return mbtaService.get({
            url: "https://api-v3.mbta.com/stops/" + entityId
        });
    }

    // internal

    function init() {
        mbtaService.get({
            url: "https://api-v3.mbta.com/stops",
            qs: {
                "filter[route_type]": "0,1"
            }
        }).then(function (data) {
            var stopIds = new Set();
            stopCache = [];

            data.forEach(function (stop) {
                var id = stop.relationships.parent_station.data.id;

                if (!stopIds.has(id)) {
                    var fullName = stop.attributes.name;
                    var name = fullName.split(" - ")[0];
                    stop.attributes.name = name;

                    var stop = {
                        id: id,
                        attributes: stop.attributes
                    };

                    stopIds.add(id);
                    stopCache.push(stop);
                }
            });

            stopCache.sort(function (stop1, stop2) {
                return stop1.attributes.name.localeCompare(stop2.attributes.name);
            });
        });
    }
};
