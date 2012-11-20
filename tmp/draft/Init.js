var app = require('App');

var requires = ['SearchBar', 'SideBar'];
var modules = {};

requires.forEach(function (moduleName) {
	var module = require(moduleName);
	var moduleApp = {};
	module.init(app);
	modules[moduleName] = module;
});