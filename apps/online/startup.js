module.exports = function(slot) {

	slot.modules.init({
		map: '.map',
		searchBar
	});

	slot.listen({
		init: function() {

		}
	});
}