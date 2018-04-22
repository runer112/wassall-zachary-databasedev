var createGenericService = require("./generic.service.server");
var routeAlertModel = require("../model/routeAlert/routeAlert.model.server.js");

module.exports = function (app, deleteChildrenByFkSupplier) {
    var alertService = createGenericService(app, "/p/api/alert", "/p/api/alert/:alertId", "alertId", null, routeAlertModel, null, deleteChildrenByFkSupplier);

    var api = alertService;
    api.find = find;

    return api;

    // API

    function find(query) {
        return routeAlertModel.find(query)
            .sort([['updatedAt', -1]]);
    }
};
