module.exports = function(slot) {
    var searchBar, dataViewer, map;
    var onlineModule = {
        init: function(state, callback) {
            slot.initModules([
                { type: 'searchBar' },
                { type: 'dataViewer' },
                { type: 'map' }
            ], callback);          
        },

        render: function() {
            return slot.templates.online({
                searchBar: slot.modules.searchBar.render(),
                sideBar: slot.modules.dataViewer.render(),
                map: slot.modules.map.render()
            });
        },

        dispatcher: {
            'searchBar:search': function(data) {
                console.log('searchBar:search');
                slot.broadcast('dataViewer:search', {what: data.what});
            }

            //'sercher:'
        },

    };

    return onlineModule;
}