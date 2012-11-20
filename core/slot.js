var async = require('async');
var _ = require('underscore');

module.exports = function(app, params) {
    var utils = app.require('core/utils');

    var moduleId = params.moduleId;

    var slot = {
        templates: params.templates,
        components: {},
        modules: {},

        registerClientScript: function(script) {
            app.clientScripts.register(script);
        },

        initModule: function(moduleConf, callback) {
            var module = app.loadModule({type: moduleConf.type, parentId: moduleId});

            module.init(moduleConf.data, function(err) {
                if (moduleConf.name !== null) {
                    var moduleName = moduleConf.name || moduleConf.type;
                    slot.modules[moduleName] = module;
                }

                callback(err, module);
            });                
        },

        initModules: function(modules, callback) {
            async.forEach(modules, slot.initModule, callback);                
        },

        requireComponent: function(componentName) {
            var componentConstructor = app.require('components/' + componentName + '/' + componentName);
            var component = componentConstructor(app);
            slot.components[componentName] = component;
            return component;
        },

        notify: function(message, data) {
            app.notify(moduleId, message, data);
        },

        broadcast: function(message, data) {
            app.broadcast(moduleId, message, data);
        },

        container: function() {
            return app.container(moduleId);
        },

        env: function() {
            return app.env();
        },

        onServer: function() {
            return slot.env() == 'server';

        },

        onClient: function() {
            return slot.env() == 'client';
        },

        rerender: function() {
            app.rerender(moduleId);
        },

        element: function(elementName) {
            return app.element(moduleId, elementName);
        },

        elements: function(elementName) {
            return app.elements(moduleId, elementName);
        },        

    };
    return slot;
}