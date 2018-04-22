var mongoose = require("mongoose");
var stopSchema = require("./stop.schema.server");
var stopModel = mongoose.model("StopModel", stopSchema);

module.exports = stopModel;
