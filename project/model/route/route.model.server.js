var mongoose = require("mongoose");
var routeSchema = require("./route.schema.server");
var routeModel = mongoose.model("RouteModel", routeSchema);

module.exports = routeModel;
