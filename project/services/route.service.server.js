module.exports = function (app, mbtaService) {
    var baseUrl = "/p/api/route";
    var entityUrl = baseUrl + "/:routeId";
    var idParam = "routeId";

    // http handlers
    app.get(baseUrl, efind);
    app.get("/p/api/stop/:stopId/route", efindForStop);
    var stopIdParam = "stopId";
    app.get(entityUrl, efindById);

    var api = {
        find: find,
        findForStop: findForStop,
        findById: findById,
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

    function efind(req, res) {
        var promise = api.find();
        esend(res, promise);
    }

    function efindForStop(req, res) {
        var stopId = req.params[stopIdParam];
        var promise = api.findForStop(stopId);
        esend(res, promise);
    }

    function efindById(req, res) {
        var entityId = req.params[idParam];
        var promise = api.findById(entityId);
        esend(res, promise);
    }

    // API

    function find() {
        return mbtaService.get({
            url: "https://api-v3.mbta.com/routes",
            qs : {
                "filter[type]": "0,1",
                "sort": "long_name"
            }
        });
    }

    function findForStop(stopId) {
        return mbtaService.get({
            url: "https://api-v3.mbta.com/routes",
            qs : {
                "filter[type]": "0,1",
                "filter[stop]": stopId,
                "sort": "long_name"
            }
        });
    }

    function findById(entityId) {
        return mbtaService.get({
            url: "https://api-v3.mbta.com/routes/" + entityId
        });
    }
};
