var mongoose = require("mongoose");

var routeAlertSchema = mongoose.Schema({
    routeId: String,
    message: String,
    direction: Number,
    updatedAt: {type: Date, default: Date.now},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "routeAlert"});

module.exports = routeAlertSchema;
