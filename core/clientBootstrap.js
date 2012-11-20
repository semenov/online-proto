var domready = require('domready');
var qwery = require('qwery');
var clientApp = require('./clientApp.js');

exports.run = function(pipeline) {
    domready(function() {
        var app = clientApp(pipeline);
        app.init(function() {

        });
    });
}