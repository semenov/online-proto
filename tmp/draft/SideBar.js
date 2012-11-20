DG.App.module('SearchBar', function(world) {
	
	function onSearch() {
		world.publish('')
	}

	return {
		depends: [
			'SearchBar'
		],
		subscriptions: {
			SearchBar: {
				search: onSearch
			}
		}

	};
});