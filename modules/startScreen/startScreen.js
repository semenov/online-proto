module.exports = function(slot) {

    var startScreenModule = {
        render: function() {
            return slot.templates.startScreen();
        },
    };

    return startScreenModule;
}