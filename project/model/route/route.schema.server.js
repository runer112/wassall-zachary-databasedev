var mongoose = require("mongoose");

var routeSchema = mongoose.Schema({
    id: String,
    attributes: {
        long_name: String,
        color: String,
        direction_names: [String]
    },
}, {collection: "route"});

module.exports = routeSchema;
