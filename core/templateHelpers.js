exports.registerHelpers = function(handlebars) {
	handlebars.registerHelper('module', function(module) {
		return new handlebars.SafeString(
			'<div class="module" data-module-id="' + module.uniqueId + '">' + module.render() + '</div>'
		);
	});
}