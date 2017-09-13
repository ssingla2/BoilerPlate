var routes = require("./regexRoutes.js");

function convertStringToRegex(routes) {
    var regexRoutes = {}
    for (var key in routes) {
        var stripRoute = routes[key].match(/\/(.*)\/i/)[1];
        regexRoutes[key] = new RegExp(stripRoute,"i");
    }
    return regexRoutes;
}

module.exports = convertStringToRegex(routes);
