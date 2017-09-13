var express = require('express');
var compress = require('compression');
var fs = require('fs');
//This dependecies should be avoided
var pathToRegexp = require('path-to-regexp');
var expressRoutes = require('./expressRoutes.js');

var path = require('path');
var app = express();
var routes = require("./expressRoutes.js");
var opn = require('opn');
var morgan = require('morgan')
var PORT = 3000;

app.use(compress());
app.use(morgan('tiny'));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/src'));



//All the requests to the server are entertained. Route handling is configured in RouteConfig
app.get('/*', function(req, res) {
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
    res.sendFile(path.join(__dirname + '/main.html'));
});

var convertToRegexRoutes = function(routes) {
    var regexRoutes = {};
    for (var key in routes) {
        regexRoutes[key] = pathToRegexp(routes[key]).toString();
    }
    return JSON.stringify(regexRoutes);
};

fs.writeFile("./regexRoutes.js", "module.exports=" + convertToRegexRoutes(expressRoutes));

app.listen(PORT, function() {
    console.log('server started at http://localhost:' + PORT);
    // Opens the url in the default browser. 
    // You can also select a specific browser, e.g. opn('http://localhost:' + PORT, {app:'chrome'})
});
