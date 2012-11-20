module.exports = function(slot) {
	var model;
	var firmModule = {
		init: function(data, callback) {
			model = data;
			callback();
		},

		render: function() {
			return slot.templates.firm(model);
		},

		elements: {
			name: {
				selector: '.firm-name',
				click: function(e) {
					console.log('Firm name clicked');
					model.expanded = !model.expanded;
					slot.rerender();
				}
			}
		}

	};

	return firmModule;
}