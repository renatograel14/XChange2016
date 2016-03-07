'use strict';

app.agenda = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_agenda
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_agenda
(function(parent) {
    var dataProvider = app.data.demoAppBackend,
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Workshops',
                dataProvider: dataProvider
            },
            group: {
                field: 'date'
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            error: function(e) {
                if (e.xhr) {
                    alert(JSON.stringify(e.xhr));
                }
            },
            schema: {
                model: {
                    fields: {
                        'name': {
                            field: 'name',
                            defaultValue: ''
                        },
                        'presenter': {
                            field: 'presenter',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        agendaModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/agenda/details.html?uid=' + e.dataItem.uid);
            },
            deleteClick: function() {
                var dataSource = agendaModel.get('dataSource');

                dataSource.remove(this.currentItem);

                dataSource.one('sync', function(e) {
                    app.mobileApp.navigate('#:back');
                });

                dataSource.one('error', function() {
                    dataSource.cancelChanges();
                });

                dataSource.sync();
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = agendaModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                agendaModel.set('currentItem', null);
                agendaModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('agendaModel', agendaModel);
        });
    } else {
        parent.set('agendaModel', agendaModel);
    }
})(app.agenda);

// START_CUSTOM_CODE_agendaModel
// END_CUSTOM_CODE_agendaModel