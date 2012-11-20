module.exports = function(slot) {
    var startScreen, searcher;
    var activeContentModule;

    var dataViewer = {

        init: function(state, callback) {
            slot.initModule({type: 'startScreen'}, function(err) {
                activeContentModule = slot.modules.startScreen;
                callback();
            });
        },

        render: function() {
            var html = slot.templates.dataViewer({
                content: activeContentModule.render()
            });
            return html;
        },

        interface: {
            search: function(data) {
                searcherData = {searchWhatText: data.what};
                slot.initModule({type: 'searcher', data: searcherData}, function(err) {
                    activeContentModule = slot.modules.searcher;
                    slot.rerender();
                });
            }

        }
    };

    return dataViewer;
}