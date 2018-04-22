var mongoose = require("mongoose");
var routeAlertSchema = require("./routeAlert.schema.server");
var routeAlertModel = mongoose.model("RouteAlertModel", routeAlertSchema);

module.exports = routeAlertModel;
