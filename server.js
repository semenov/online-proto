var express = require('express');
var fs = require('fs');
var async = require('async');
var less = require('less');
var browserify = require('browserify');
var handlebars = require('handlebars');
var beautifier = require('beautifier');
var _ = require('underscore');

var server = express();
server.use(express.static(__dirname + '/public'));

var config = {
    modules: [
        'dataViewer',
        'firm',
        'firmList',
        'map', 
        'online',
        'paginator',
        'searchBar',
        'searcher',
        'startScreen'
    ],

    mainModule: 'online',

    components: [
        'dgApi'
    ]
};

var appConstructor = require('./core/serverApp');


server.get('/', function(req, res) {

    var app = appConstructor({
        rootPath: __dirname
    });

    app.init(function() {

        app.clientScripts.register('/app.js');
        app.clientScripts.register('/js/handlebars-1.0.0.beta.6.js');

        var templates = [];
        
        _.each(app.modules, function(module, moduleName) {
            _.each(module.rawTemplates, function(source, template) {
                templates.push({
                    id: 'template_' + moduleName + '_' + template,
                    html: source
                });
            });
        });

        var filename = 'apps/online/layout.html';

        fs.readFile(filename, 'utf-8', function(err, source) {
            var template = handlebars.compile(source);
            var data = {
                clientScripts: app.clientScripts.list(),
                templates: templates
            };

            var mainModule = app.loadModule({type: config.mainModule});
            mainModule.init(null, function() {
                var moduleHtml = mainModule.render();
                data.content = moduleHtml;
                data.pipeline = JSON.stringify(app.pipeline());
                var html = template(data);
                //html = beautifier.html_beautify(html, {indent_scripts: 'normal'});
                res.send(html);
            });


        });
    });
});

server.get('/browserify.js', function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    var b = browserify();
    res.end(b.bundle());
});

server.get('/browserify/*', function(req, res) {
    var b = browserify();
    b.files = [];
    b.prepends = [];
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    var file = './' + req.params[0];
    b.require(file);
    res.end(b.bundle());
});

server.get('/app.js', function(req, res) {
    var b = browserify();
    //b.files = [];
    //b.prepends = [];
    res.writeHead(200, {'Content-Type': 'application/javascript'});

    b.require('./core/clientBootstrap');
    b.require('./core/clientApp');
    b.require('./core/slot');
    b.require('./core/utils');
    b.require('./core/moduleWrapper');

    config.modules.forEach(function(item) {
        var file = './modules/' + item + '/' + item + '.js';
        if (fs.existsSync(file)) {
            b.require(file);
        }
    });
    
    config.components.forEach(function(item) {
        var file = './components/' + item + '/' + item + '.js';
        if (fs.existsSync(file)) {
            b.require(file);
        }
    });
    

    res.end(b.bundle());
});

server.get('/app.css', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/css'});

    var files = _.map(config.modules, function(moduleName) {
        return 'modules/' + moduleName + '/' + moduleName + '.less';
    });

    files.unshift('apps/online/base.less');

    async.reduce(files, '', function(memo, filename, callback) {
        fs.readFile(filename, 'utf-8', function(err, moduleStyles) {
            if (err) {
                moduleStyles = '';
            } else {
                moduleStyles = "\n\n/* " + filename + " */\n" + moduleStyles; 
            }

            callback(null, memo + moduleStyles)
        });
        
    }, function(err, result) {
        less.render(result, function(err, css) {
            res.end(css);
        })
    });
});


server.listen(3000);
console.log('Listening on port 3000');