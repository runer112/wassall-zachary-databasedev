var mongoose = require("mongoose");

var favoriteSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
    routeId: String,
    direction: Number,
    stopId: String,
}, {collection: "favorite"});

module.exports = favoriteSchema;
