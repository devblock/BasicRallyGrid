Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
	launch: function() {
		console.log('Our First App woot');
		
		this._loadData();
	},
	
	// Get data from Rally
	_loadData: function() {
		var myStore = Ext.create('Rally.data.wsapi.Store', {
			model: 'User Story',
			autoLoad: true,
			listeners: {
				load: function(store, data, success) {
					//console.log('got data!', store, data, success);
					this._loadGrid(myStore);
				},
				scope: this
			},
			fetch: ['Name', 'ScheduleState', 'formattedID']
		});
	},
	
	// Create Grid
	_loadGrid: function(myStoryStore) {
		var myGrid = Ext.create('Rally.ui.grid.Grid', {
			store: myStoryStore,
			columnCfgs: [
				'FormattedID',
				'Name',
				'ScheduleState'
			]
		});
		
		this.add(myGrid);
	}
});
