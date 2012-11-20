var utils = require('./utils');

// Module wrapper expects a raw module objects as an argument for constructor.
module.exports = function(app, moduleConf, slot) {

    var moduleWrapper = {

        // Initializes the module with the given params. Invokes callback when init process is ready
        init: function(state, callback) {

            if (app.env() == 'client') {

            }

            if (moduleConf.init) {
                moduleConf.init(state, function(err) {
                    callback(err);
                });
            } else {
                callback(null);
            }
        },

        clientInit: function() {
            if (moduleConf.clientInit) {
                moduleConf.clientInit();
            }
        },

        // Renders the module and wraps it in a div with special metadata to identify this module in DOM.
        // Returns rendered HTML.
        render: function() {
            var html = utils.invoke(moduleConf.render) || '';
            var result = '<div class="module module-' + moduleConf.uniqueId + '" data-module-id="' + moduleConf.uniqueId + '">' + html + '</div>';
            return result;
        },

        slot: slot
    };

    return moduleWrapper;
}