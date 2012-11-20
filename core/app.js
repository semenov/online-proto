var _ = require('underscore');
var hat = require('hat');

module.exports = function(params) {
    var internals = {
        clientScripts: [],
        moduleInstances: {},
    };

    _.extend(internals, params);


    var app = {
        modules: {},
        templates: {},
        templateSources: {},
        stylesheets: {},

        clientScripts: {
            register: function(script) {
                internals.clientScripts.push(script);
            },
            
            list: function() {
                return internals.clientScripts;
            }
        },

        require: function(path) {
            return require(internals.rootPath + path);
        },

        loadModule: function(data) {
            var moduleId = data.id || hat(32);
            var moduleName = data.type;
            var parentId = data.parentId;
            var slotConstructor = app.require('core/slot');
            var moduleConstructor = app.require('modules/' + moduleName + '/' + moduleName);
            var slot = slotConstructor(app, {
                moduleId: moduleId,
                templates: app.modules[moduleName].templates,
            });

            var module = moduleConstructor(slot);
            module.uniqueId = moduleId;
            module.type = moduleName; 

            var moduleInstance = {
                id: moduleId,
                instance: module,
                slot: slot,
                type: moduleName,
                parentId: parentId,
                children: data.children || [],
                container: data.container
            };

            internals.moduleInstances[moduleId] = moduleInstance;

            if (parentId) {
                internals.moduleInstances[parentId].children.push(moduleId);
            }  
            
            if (_.isArray(module.clientScripts)) {
                module.clientScripts.forEach(function(script) {
                    app.clientScripts.register(script);
                });
            }

            var moduleWrapperConstructor = app.require('core/moduleWrapper');
            var moduleWrapper = moduleWrapperConstructor(app, module, slot);
    
            return moduleWrapper;
        },

        getModuleById: function(moduleId) {
            return internals.moduleInstances[moduleId];
        }

    };

    return {
        instance: app,
        internals: internals
    };
}