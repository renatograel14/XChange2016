// logica do local binding
'use strict';

(function () {
	// set data if is undefined
	// localStorage.clear();
	function setNew(){
		if(!localStorage["agenda"]){
			localStorage["agenda"] = JSON.stringify([]);
			console.log(localStorage['agenda']);
		}
	}


	var localStorageOptions = {
		transport: {
			create: function(options){
				//função que cria registro local
				var newItem = options.data;
				newItem.itemId = options.data.Id;
				var localData = JSON.parse(localStorage["agenda"]);

				console.log('added', newItem);
				localData.push(newItem);
				localStorage["agenda"] = JSON.stringify(localData);				
				options.success(newItem);
			},
			read: function(options){
				// pega o array de contatos gravados localmente
				var localData = JSON.parse(localStorage["agenda"]);
				options.success(localData);
			},
			destroy: function(options){
				console.log('removed', options.data);
				//apaga registro
				var localData = JSON.parse(localStorage["agenda"]);
				for(var i=0; i<localData.length; i++){
					if(options.data.Id === localData[i].Id){
						localData.splice(i,1);
						break;
					}
				}
				localStorage["agenda"] = JSON.stringify(localData);
				options.success(options.data);
			}
		},
		group: { field: "date" },
		schema: {
			model: {
				id: "itemId",
				fields: {
					itemId: {type: 'string'},
					Id: {type: 'string'},
					name: {type: 'string'},
					presenter: {type: 'string'},
					date: {type: 'string'}
				}
			}
		}
	}

	// set dataSource on a global variable
	var provider = app.data.localStorage = {
		dataSource: new kendo.data.DataSource(localStorageOptions),
		resetData: function(callback){
			localStorage.clear();
			setNew();
		},
		getAgendaItem: function(record){
			return {
				Id: record.Id,
				name: record.name,
				presenter: record.presenter,
				date: record.date,
			};
		}
	}

})();