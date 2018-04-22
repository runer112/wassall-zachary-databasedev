var createGenericService = require("./generic.service.server");
var favoriteModel = require("../model/favorite/favorite.model.server.js");

module.exports = function (app, deleteChildrenByFkSupplier) {
    var favoriteService = createGenericService(app, "/p/api/user/:userId/favorite", "/p/api/user/:userId/favorite/:favoriteId", "favoriteId", "userId", favoriteModel, null, deleteChildrenByFkSupplier);
    return favoriteService;
};
