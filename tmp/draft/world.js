module.exports = function(slot) {
	
	slot.init({
		name: 'world',
		modules: [
			'searchBar',
			'map'
		],
		components: [
			'geodata',
			'config'
		]
	});

	slot.modules.searchBar.subscribe('searchByWhat', function(data) {

	});

	slot.components.geodata.get('project/list');
	var apiKey = slot.components.config.apiKey;

	slot.modules.searchBar.subscribe({
		searchByWhat: function(data) {

		},
		searchByWhere: function(data) {

		},		
	});

	var map = slot.modules.map;


	map.subscribe('changeLocation', function(coords) {

	});

	map.publish();

	slot.publish('activeTabChanged');


	console.log('Hello, sandbox!');
}