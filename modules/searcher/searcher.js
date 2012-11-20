module.exports = function(slot) {

    slot.requireComponent('dgApi');

    var dgApi = slot.components.dgApi;
    var searchWhatText = '';

    var searcher = {
        init: function(data, callback) {
            searchWhatText = data.searchWhatText;

            dgApi.catalog.search(searchWhatText, function(err, result) {
                slot.notify('firmsReady', result);
                slot.initModule({type: 'firmList', data: result}, callback);
            });
        },

        render: function() {
            return slot.templates.searcher({
                searchWhatText: searchWhatText,
                firmList: slot.modules.firmList.render()
            });
        },
    };

    return searcher;
}