module.exports = function(slot) {
    var model = {};
    var searchBarModule = {

        render: function() {
            return slot.templates.searchBar();
        },

        elements: {
            searchForm: {
                selector: '.searchForm',
                submit: function(e) {
                    e.preventDefault();
                    console.log('submit');

                    var searchText = slot.element('searchText').val();
                    slot.notify('search', {what: searchText});
                }
            },

            searchText: {
                selector: '.searchText'
            },
        },

        dispatcher: {

        },

        interface: {
        }
    };

    return searchBarModule;
}