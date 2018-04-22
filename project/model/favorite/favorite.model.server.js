var mongoose = require("mongoose");
var favoriteSchema = require("./favorite.schema.server");
var favoriteModel = mongoose.model("FavoriteModel", favoriteSchema);

module.exports = favoriteModel;
