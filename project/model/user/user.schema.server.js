var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    isAdmin: Boolean,
    isOfficial: Boolean,
    facebook: {
        id:    String,
        token: String
    },
    username: {type: String, unique: true, sparse: true},
    password: String,
    displayName: String,
    email: String,
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: "UserModel"}],
    favorites: [{
        routeId: String,
        direction: Number,
        stopId: String
    }],
    dateCreated: {type: Date, default: Date.now}
}, {collection: "user"});

module.exports = userSchema;
