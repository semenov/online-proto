module.exports = function(slot) {

    var dgMap;
    var map = {

        render: function() {
            return slot.templates.map();
        },

        clientInit: function() {
            DG.load(function() {
                var mapContainer = slot.element('map')[0];
                console.log('mapContainer', mapContainer);
                dgMap = new DG.Map(mapContainer);
                dgMap.setCenter(new DG.GeoPoint(82.927,55.028), 15);

                // Грязный хак для того чтобы балуны не залазили под сайдбар,
                // не для использования в продакшене
                var position = new DG.ControlPosition(DG.ControlPosition.TOP_LEFT, new DG.Point(0, 0));
                var BlindControl = DG.Controls.Abstract.extend({
                    onAddToMap: function (map) { 
                        var container = this.getContainer(); 
                        container.style.width = '550px';
                        container.style.height = '800px';
                        container.style.zIndex = -1000;
                    },

                    onRemoveFromMap: function() {
                    }
                });

                dgMap.controls.add(new BlindControl('blindControl'), null, position);
            });
        },

        elements: {
            map: {
                selector: '.map'
            }
        },

        clientScripts: ['http://maps.api.2gis.ru/1.0?loadByRequire=1']
    };

    return map;

}