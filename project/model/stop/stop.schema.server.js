var mongoose = require("mongoose");

var stopSchema = mongoose.Schema({
    id: String,
    attributes: {
        name: String,
        latitude: Number,
        longitude: Number
    },
}, {collection: "stop"});

module.exports = stopSchema;
