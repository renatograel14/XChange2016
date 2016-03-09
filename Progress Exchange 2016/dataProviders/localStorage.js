// logica do local binding
'use strict';

(function () {
	// set data if is undefined
	// localStorage.clear();
	if(!localStorage["agenda"]){
		console.log(localStorage['agenda']);
		localStorage["agenda"] = JSON.stringify([]);
	}


	var localStorageOptions = {
		transport: {
			create: function(options){
				//function to create a new local record
				var localData = JSON.parse(localStorage["agenda"]);
				localData.push(options.data);
				localStorage["agenda"] = JSON.stringify(localData);
				options.success(options);
				options.error(options);
			},
			read: function(options){
				// get agenda array
				var localData = JSON.parse(localStorage["agenda"]);
				options.success(localData);
			},
			destroy: function(options){
				//delete options.data (record to be deleted)
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
		schema: {
			model: {id: 'Id'}
		}
	}

	// set dataSource on a global variable
	app.data.localStorage = {
		dataSource: new kendo.data.DataSource(localStorageOptions),
		resetData: function(callback){
			localStorage.clear();
			callback();
		},
		getAgendaItem: function(record){
			return {
				id: record.id,
				name: record.name,
				presenter: record.presenter,
				date: record.date
			};
		}
	}
})();