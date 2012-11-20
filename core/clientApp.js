var async = require('async');
//var handlebars = require('handlebars');
var handlebars = Handlebars;
var _ = require('underscore');
var utils = require('./utils');
var baseAppConstructor = require('./app');


module.exports = function(params) {

    var baseApp = baseAppConstructor({
        rootPath: '/'
    });

    var app = baseApp.instance;
    var internals = baseApp.internals;

    var qwery = require('qwery');
    var bonzo = require('bonzo');
    var $ = function(selector) {
        return bonzo(qwery(selector));
    };

    _.extend(app, {
        init: function(callback) {

            // Инициализируем массив модулей, аггрегируем и компилируем шаблоны
            _.each(params.modules, function(module, moduleName) {
                app.modules[moduleName] = {
                    templates: {},
                    rawTemplates: {}
                };

                _.each(module.templates, function(templateName) {
                    var id = '#template_' + moduleName + '_' + templateName;
                    var source = $(id).html();
                    app.modules[moduleName].rawTemplates[templateName] = source;
                    app.modules[moduleName].templates[templateName] = handlebars.compile(source);
                });
            });

            // Ищем самый главный рутовый модуль — вершину дерева
            var rootModule = _.find(params.moduleInstances, function(moduleData) {
                return !moduleData.parentId;
            });

            initModule(rootModule.id);

            // Функция загружает модуль, делает клиентскую инициализацию и
            // и выполнять эти же действия для всех дочерних модулей
            function initModule(moduleId) {
                var moduleData = params.moduleInstances[moduleId];
                var selector = ".module-" + moduleData.id;
                var moduleElement = qwery(selector);

                var module = app.loadModule({
                    type: moduleData.type, 
                    id: moduleData.id, 
                    parentId: moduleData.parentId,
                    children: [],
                    container: bonzo(moduleElement)
                });

                module.clientInit();

                _.each(moduleData.children, function(moduleId) {
                    initModule(moduleId);
                });
            }

            // Навешиваем события на все модули
            bindEventListeners(rootModule.id);

        },

        notify: function (moduleId, message, data) {
            var activeModule = internals.moduleInstances[moduleId];
            var action = activeModule.type + ':' + message;
            var currentModuleId = activeModule.parentId;

            while (currentModuleId) {
                activeModule = internals.moduleInstances[currentModuleId];
                var module = activeModule.instance;
                var dispatcher = module.dispatcher;
                
                if (dispatcher) {
                    var handler = dispatcher[action];
                    if (handler) {
                        handler(data);
                    }
                }

                currentModuleId = activeModule.parentId;
            }
        },

        broadcast: function (moduleId, message, data) {
            var parts = message.split(':', 2);
            var targetModule = _.first(parts);
            var targetAction = _.last(parts);
            processChildren(moduleId);

            function processChildren(currentModuleId) {

                var activeModule = internals.moduleInstances[currentModuleId];
                if (activeModule.type == targetModule) {
                    var module = activeModule.instance;
                    if (module.interface) {
                        var handler = module.interface[targetAction];
                        if (handler) {
                            handler(data);
                        }
                    }
                }

                _.each(activeModule.children, processChildren);
            }
        },

        container: function(moduleId) {
            var activeModule = internals.moduleInstances[moduleId];
            return activeModule.container;
        },

        env: function() {
            return 'client';
        },

        rerender: function(moduleId) {
            var activeModule = app.getModuleById(moduleId);
            var html = utils.invoke(activeModule.instance.render);
            $('.module-' + moduleId).html(html);
            //activeModule.container.html(html);
            bindEventListeners(moduleId);
        },

        element: function(moduleId, elementName) {
            var module = app.getModuleById(moduleId);
            var elements = module.instance.elements;

            if (elements && elements[elementName]) {
                var selector = elements[elementName].selector;
                return bonzo(qwery(selector, '.module-' + moduleId)[0]);
            } 
        },

        elements: function(moduleId, elementName) {
            var module = app.getModuleById(moduleId);
            var elements = module.instance.elements;

            if (elements && elements[elementName]) {
                var selector = elements[elementName].selector;
                return bonzo(qwery(selector, '.module-' + moduleId));
            } 
        }

    });

    var bean = require('bean');

    // Функция навешивает события на элементы модуля и все дочерние модули
    function bindEventListeners(moduleId) {
        var module = app.getModuleById(moduleId);

        // Пробегаемся по ассоциативному массиву элементов, заданном в модуле
        _.each(module.instance.elements, function(eventsConfig, elementName) {
            var selector = eventsConfig.selector;
            // Выбираем все значения из объекта, за исключением селектора
            var handlers  = _.omit(eventsConfig, 'selector');   

            _.each(handlers, function(handler, eventName) {
                console.log(module.container);
                var domElements = qwery(selector, '.module-' + moduleId);
                _.each(domElements, function(domElement) {
                    bean.on(domElement, eventName, handler);
                });
            });         
        });

        // Рекурсивно вызываем функцию для всех дочерних элементов
        _.each(module.children, function(childModuleId) {
            bindEventListeners(childModuleId);
        });

    }

    return app;
}