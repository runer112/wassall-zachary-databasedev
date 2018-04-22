var request = require('request');
var $q = require('q');

module.exports = function () {
    var api = {
        get: get
    };

    return api;

    function get(options) {
        options.headers = {
            "x-api-key": process.env.MBTA_API_KEY
        };
        options.json = true;

        var deferred = $q.defer();

        request.get(options, function (err, res, body) {
            if (err) {
                deferred.reject("Failed to load MBTA data");
            } else {
                deferred.resolve(body.data);
            }
        });

        return deferred.promise;
    }
};
