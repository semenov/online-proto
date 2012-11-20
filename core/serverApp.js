var async = require('async');
var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var _ = require('underscore');
var helpers = require('./templateHelpers');
var baseAppConstructor = require('./app');

helpers.registerHelpers(handlebars);

module.exports = function(params) {

    var baseApp = baseAppConstructor({
        rootPath: params.rootPath + '/'
    });

    var app = baseApp.instance;
    var internals = baseApp.internals;

    _.extend(app, {
        init: function(callback) {
            var modulesPath = internals.rootPath + '/modules/';

            readAllModulesFiles(callback);

            function readAllModulesFiles(callback) {
                fs.readdir(modulesPath, function(err, modules) {
                    async.forEach(modules, readModuleFiles, callback);
                });
            }

            function readModuleFiles(moduleName, callback) {
                var modulePath = modulesPath + moduleName + '/';
                app.modules[moduleName] = {
                    templates: {},
                    rawTemplates: {}
                };
                fs.readdir(modulePath, function(err, files) {
                    async.forEach(files, processFile(moduleName), callback);
                });         
            }

            function processFile(moduleName) {
                return function(filename, callback) {
                    var fullPath = modulesPath + moduleName + '/' + filename;
                    var extension = path.extname(filename);
                    var basename = path.basename(filename, extension);
                    if (extension == '.html') {
                        fs.readFile(fullPath, 'utf-8', function(err, source) {
                            app.modules[moduleName].rawTemplates[basename] = source;
                            var compiledTemplate = handlebars.compile(source);
                            app.modules[moduleName].templates[basename] = function(data) {
                                data = data || {};
                                return compiledTemplate(data);
                            };
                            callback();
                        });
                    } else {
                        callback();
                    }
                };

            }
        },

        pipeline: function() {
            var pipeline = {
                modules: {},
                moduleInstances: {}
            };

            _.each(app.modules, function(module, moduleName) {
                pipeline.modules[moduleName] = {
                    templates: Object.keys(module.templates)
                };
            });

            _.each(internals.moduleInstances, function(module, moduleId) {
                pipeline.moduleInstances[moduleId] = {
                    id: moduleId,
                    type: module.type,
                    parentId: module.parentId,
                    children: module.children,
                    state: {}
                };
            });

            return pipeline;
        },

        env: function() {
            return 'server';
        }
    });

    return app;
}