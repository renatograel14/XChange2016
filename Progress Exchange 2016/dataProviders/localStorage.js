'use strict';


(function () {


	var flattenLocationProperties = function(dataItem) {
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
	};


	app.data.setData = function(){
		localStorage["agenda"] = JSON.stringify([]);
	}	

	app.data.resetData = function(){
		app.data.setData();
		window.location.reload();
	}

	var provider = app.data.localStorage = new kendo.data.DataSource({
		transport: {
			create: function(options){
				var localData = JSON.parse(localStorage["agenda"]);
				localData.push(options.data);
				localStorage["agenda"] = JSON.stringify(localData);
				options.success(options.data);
			},
			read: function(options){
				var localData = JSON.parse(localStorage["agenda"]);
				options.success(localData);
			},
			destroy: function(options){
				var localData = JSON.parse(localStorage["agenda"]);
				for(var i=0; i<localData.length; i++){
					if(options.data.username === localData[i].username){
						localData.splice(i,1);
						break;
					}
				}
				localStorage["agenda"] = JSON.stringify(localData);
				options.success(options.data);
			}
		},
		change: function(e) {
			var data = this.data();
			for (var i = 0; i < data.length; i++) {
				var dataItem = data[i];

				flattenLocationProperties(dataItem);
			}
		},
		schema: {
			model: {
				id: "ID",
				fields: {
					ID: { type: "number", editable: false }
				}
			}
		}
	});

	if(!localStorage["agenda"]){
		app.data.setData();
	}

})();
