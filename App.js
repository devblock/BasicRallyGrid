Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	myGrid: undefined,
	defectStore: undefined,
    
	launch: function() {
		console.log('Our Second App woot');
		
		this.pulldownContainer = Ext.create('Ext.container.Container', {
			layout: {
				type: 'hbox',
				align: 'stretch'
			}
		});
		
		this.add(this.pulldownContainer);
		
		this._loadIterations();
	},
	
	_loadIterations: function() {
		this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
			fieldLabel: 'Iteration',
			labelAlign: 'right',
			width: 300,
			listeners: {
				ready: function(combobox) {
					//var selectedIterRef = combobox.getRecord().get('_ref');
					//this._loadData();
					this._loadSeverities();
				},
				select: function(combobox, records) {
					this._loadData();
				},
				scope: this
			}
		});
		
		this.pulldownContainer.add(this.iterComboBox);
	},
	
	_loadSeverities: function() {
		this.severityPicker = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
			model: 'Defect',
			field: 'Severity',
			fieldLabel: 'Severity',
			labelAlign: 'right',
			listeners: {
				ready: function(combobox) {
					this._loadData();
				},
				select: function(combobox, records) {
					this._loadData();
				},
				scope: this
			}
		});
		
		this.pulldownContainer.add(this.severityPicker);
	},
	
	// Get data from Rally
	_loadData: function() {
		var selectedIterRef = this.iterComboBox.getRecord().get('_ref'); // selected iteration
		var selectedSeverityValue = this.severityPicker.getRecord().get('value'); // selected severity

		var myFilters = [
			{
				property: 'Iteration',
				operation: '=',
				value: selectedIterRef
			},
			{
				property: 'Severity',
				operation: '=',
				value: selectedSeverityValue
			}
		];
		
		// if store exists, just load new data
		if (this.defectStore) {
			console.log('store exists');
			this.defectStore.setFilter(myFilters);
			this.defectStore.load();
		} else {
			console.log('creating store');
			//create store
			this.defectStore = Ext.create('Rally.data.wsapi.Store', {
				model: 'Defect',
				autoLoad: true,
				filters: myFilters,
				listeners: {
					load: function(store, data, success) {
						//console.log('got data!', store, data, success);
						if (!this.myGrid) {
							this._createGrid(this.defectStore);
						}
					},
					scope: this
				},
				fetch: ['Name', 'formattedID', 'Severity', 'Iteration']
			});
		}
	},
	
	// Create Grid
	_createGrid: function(myStoryStore) {
		this.myGrid = Ext.create('Rally.ui.grid.Grid', {
			store: myStoryStore,
			columnCfgs: [
				'FormattedID',
				'Name',
				'Severity',
				'Iteration'
			]
		});
		
		this.add(this.myGrid);
	}
});
