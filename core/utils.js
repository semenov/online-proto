var utils = module.exports = {
	invoke: function(func, args) {
		if (func) {
			return func.apply(null, args);
		}
	},

	invokeWithCallback: function(func, arg, callback) {
		if (func) {
			func.apply(null, [arg, callback]);
		} else {
			callback();
		}
	}
}