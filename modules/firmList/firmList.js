var _ = require('underscore');
var async = require('async');

module.exports = function(slot) {
    var firmModules = [],
        firms;
    var firmList = {
        init: function(data, callback) {
            firms = data.firms;

            async.map(firms, loadFirmModule, function(err, modules) {
                firmModules = modules;
                callback();
            });

            function loadFirmModule(firm, callback) {
                slot.initModule({type: 'firm', data: firm}, callback);
            }
        },

        render: function() {
            var renderedFirms = _.map(firmModules, function(firmModule) {
                return firmModule.render();
            });

            return slot.templates.firmList({
                firms: renderedFirms 
            });
        }
    };

    return firmList;

}