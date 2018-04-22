module.exports = function (app) {
    var services = {};
    services.userService = require("./services/user.service.server.js")(app, services, function () {
        return null;
    });
    services.mbtaService = require("./services/mbta.service.server.js")();
    services.routeService = require("./services/route.service.server.js")(app, services.mbtaService);
    services.stopService = require("./services/stop.service.server.js")(app, services.mbtaService);
    services.departureService = require("./services/departure.service.server.js")(app, services);
    services.alertService = require("./services/alert.service.server.js")(app, function () {
        return null;
    });
};
