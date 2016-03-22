'use strict';

app.workshops = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_workshops
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_workshops
(function(parent) {
    var dataProvider = app.data.demoAppBackend,
    agendaDataSource = app.data.localStorage,
    processImage = function(img) {
        if (!img) {
            var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
            img = 'data:image/png;base64,' + empty1x1png;
        } else if (img.slice(0, 4) !== 'http' &&
            img.slice(0, 2) !== '//' && img.slice(0, 5) !== 'data:') {
            var setup = dataProvider.setup || {};
            img = setup.scheme + ':' + setup.url + setup.appId + '/Files/' + img + '/Download';
        }

        return img;
    },
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
                // console.log(dataItem);
            }


        },
        error: function(e) {
            if (e.xhr) {
                alert(JSON.stringify(e.xhr));
            }
        },
        schema: {
            data: function(data){
                data.result.forEach(function(item){
                    item.agenda = !agendaDataSource.dataSource.get(item.Id);
                });
                return data.result;
            },
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
                    'agenda': {
                        type: 'boolean'
                    }
                }
            }
        },
    },
    dataSource = new kendo.data.DataSource(dataSourceOptions),
    workshopsModel = kendo.observable({
        dataSource: dataSource,
        addItem: function() {
            console.log('adding...');

            agendaDataSource.dataSource.add(agendaDataSource.getAgendaItem(workshopsModel.currentItem));
            agendaDataSource.dataSource.sync();

        },
        deleteItem: function() {
            var agendaItem = agendaDataSource.dataSource.get(workshopsModel.currentItem.Id);
            agendaDataSource.dataSource.remove(agendaItem);
            agendaDataSource.dataSource.sync();
        },
        changeSwitch: function(e) {
            if(e.checked){
                workshopsModel.addItem();
            } else {
                workshopsModel.deleteItem();
            }
        },
        checked: false,
        toggleSwitch: function(){
            var itemAvailable = !!agendaDataSource.dataSource.get(workshopsModel.currentItem.Id),
            switchButton = $("#switch").data("kendoMobileSwitch");
            
            if(itemAvailable != workshopsModel.checked){
                workshopsModel.checked = itemAvailable;
                switchButton.toggle();
            } 
        },
        itemClick: function(e) {
            // console.log(e);
            app.mobileApp.navigate('#components/workshops/details.html?uid=' + e.dataItem.uid);
        },
        detailsShow: function(e) {

            var item = e.view.params.uid,
            dataSource = workshopsModel.get('dataSource'),
            itemModel = dataSource.getByUid(item);
            itemModel.photoUrl = processImage(itemModel.photo);

            if (!itemModel.date) {
                itemModel.date = String.fromCharCode(160);
            }

            workshopsModel.set('currentItem', null);
            workshopsModel.set('currentItem', itemModel);
            workshopsModel.toggleSwitch();
        },
        currentItem: null
    });


    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('workshopsModel', workshopsModel);
        });
    } else {
        parent.set('workshopsModel', workshopsModel);
    }
})(app.workshops);

// START_CUSTOM_CODE_workshopsModel
// END_CUSTOM_CODE_workshopsModel