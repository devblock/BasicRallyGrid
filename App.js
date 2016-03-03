Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	
	items: [
		{
			xtype: 'container',
			itemId: 'pulldown-container',
			layout: {
				type: 'hbox',
				align: 'stretch'
			}
		}
	],
	
	myGrid: undefined,
	defectStore: undefined,
    
	launch: function() {
		console.log('Our Second App woot');
		
		this._loadIterations();
	},
	
	_loadIterations: function() {
		var me = this;
		
		var iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
			itemId: 'iteration-combobox',
			fieldLabel: 'Iteration',
			labelAlign: 'right',
			width: 300,
			listeners: {
				ready: me._loadSeverities,
				select: me._loadData,
				scope: me
			}
		});
		
		//this.pulldownContainer.add(this.iterComboBox);
		this.down('#pulldown-container').add(iterComboBox);
	},
	
	_loadSeverities: function() {
		var me = this;
		
		var severityPicker = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
			itemId: 'severity-combobox',
			model: 'Defect',
			field: 'Severity',
			fieldLabel: 'Severity',
			labelAlign: 'right',
			listeners: {
				ready: me._loadData,
				select: me._loadData,
				scope: me
			}
		});
		
		this.down('#pulldown-container').add(severityPicker);
	},
	
	_getFilters: function(iterationValue, severityValue) {
		var iterationFilter = Ext.create('Rally.data.wsapi.Filter', {
			property: 'Iteration',
			operation: '=',
			value: iterationValue
		});
		
		var severityFilter = Ext.create('Rally.data.wsapi.Filter', {
			property: 'Severity',
			operation: '=',
			value: severityValue
		});
		
		return iterationFilter.and(severityFilter);
	},
	
	// Get data from Rally
	_loadData: function() {
		var me = this;
		
		var selectedIterRef = me.down('#iteration-combobox').getRecord().get('_ref'); // selected iteration
		var selectedSeverityValue = me.down('#severity-combobox').getRecord().get('value'); // selected severity

		var myFilters = me._getFilters(selectedIterRef, selectedSeverityValue);
		
		// if store exists, just load new data
		if (me.defectStore) {
			console.log('store exists');
			me.defectStore.setFilter(myFilters);
			me.defectStore.load();
		} else {
			console.log('creating store');
			//create store
			me.defectStore = Ext.create('Rally.data.wsapi.Store', {
				model: 'Defect',
				autoLoad: true,
				filters: myFilters,
				listeners: {
					load: function(store, data, success) {
						//console.log('got data!', store, data, success);
						if (!me.myGrid) {
							me._createGrid(me.defectStore);
						}
					},
					scope: me
				},
				fetch: ['Name', 'formattedID', 'Severity', 'Iteration']
			});
		}
	},
	
	// Create Grid
	_createGrid: function(myStoryStore) {
		var me = this;
		
		me.myGrid = Ext.create('Rally.ui.grid.Grid', {
			store: myStoryStore,
			columnCfgs: [
				'FormattedID',
				'Name',
				'Severity',
				'Iteration'
			]
		});
		
		me.add(me.myGrid);
	}
});
