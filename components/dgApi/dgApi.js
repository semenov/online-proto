module.exports = function(app) {
    //var request = app.require('core/request');

    function get(url, params, callback) {
        params.key = 'rudcgu3317';
        params.version = '1.3';
        
        if (app.env() == 'server') {
            var request = require('request');
            var conf = {
                url: url,
                qs: params,
            };

            request(conf, function(err, response, body) {
                callback(JSON.parse(body));
            });

        } else {
            var reqwest = require('reqwest');
            params.output = 'jsonp';
            reqwest({
                url: url + '?callback=?',
                data: params,
                type: 'jsonp',
                success: function (response) {
                    callback(response);
                }
            })

        }               
    }

    var catalogUrl = 'http://catalog.api.2gis.ru/';

    function catalog(method, params, callback) {
        get(catalogUrl + method, params, callback);
    }

    var dgApi = {
        catalog: {
            search: function(what, callback) {
                var params = {
                    what: what,
                    where: 'Новосибирск'
                };

                catalog('search', params, function(data) {
                    var result = {
                        totalCount: data.total,
                        firms: data.result
                    };

                    callback(null, result);
                });
            }        
        }

    };

    return dgApi;
}