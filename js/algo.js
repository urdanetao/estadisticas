
/**
 * Coloca el formulario en modo edicion para agregar.
 */
function commandAlgoAddButtonClick() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	// Guarda los valores del registro actual.
	core.data.save(currentArea, 'backup', core.form.getData(currentArea));

	// Inicializa un registro en blanco.
	var r = core.form.getData(currentArea, true);

	core.form.setData(currentArea, r);
	core.form.setState(currentArea, core.form.state.editing);
}

/**
 * Coloca el formulario en modo edicion para modificar.
 */
function commandAlgoEditButtonClick() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	// Guarda los valores del registro actual.
	core.data.save(currentArea, 'backup', core.form.getData(currentArea));

	// Coloca el formulario en modo edicion.
	core.form.setState(currentArea, core.form.state.editing);
}

/**
 * Guarda el registro actual.
 */
function commandAlgoSaveButtonClick() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	// Toma el registro desde los controles del formulario.
	var r = core.transform2Json(core.form.getData(currentArea));

	// Ejecuta la funcion.
	core.showLoading();
	core.apiFunction('algoSave', r, (response) => {
		core.hideLoading();

		if (!response.status) {
			core.showMessage(response.message, 4, core.color.error);
			return;
		}

		core.showMessage(response.message, 4, core.color.success);

		var currentArea = core.tabs.getActiveTabArea('.main-work-area');
		r.id = response.data.id;
		core.form.setData(currentArea, r);
		core.form.setState(currentArea, core.form.state.showing);

		algoShowLast();
	});
}

/**
 * Cancela la edicion del registro actual.
 */
function commandAlgoCancelButtonClick() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	// Restaura el registro anterior.
	var r = core.data.restore(currentArea, 'backup');
	core.form.setData(currentArea, r);

	// Establece el estado del formulario.
	if (r.id == '') {
		core.form.setState(currentArea, core.form.state.noShow);
	} else {
		core.form.setState(currentArea, core.form.state.showing);
	}
}

/**
 * Elimina el registro actual.
 */
function commandAlgoDeleteButtonClick() {
	// Confirma con el usuario.
	core.showConfirm({
		'icon': 'icon icon-bin',
		'title': 'Confirmar Eliminar',
		'message': 'Se dispone a eliminar el registro, ¿está seguro?',
		'callbackOk': () => {
			// Toma el registro desde los controles del formulario.
			var currentArea = core.tabs.getActiveTabArea('.main-work-area');
			var r = core.transform2Json(core.form.getData(currentArea));

			core.showLoading();
			core.apiFunction('algoDelete', {'id': r.id}, (response) => {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}

				core.showMessage(response.message, 4, core.color.success);
				core.form.setData(currentArea, core.form.getData(currentArea, true));
				core.form.setState(currentArea, core.form.state.noShow);
				algoShowLast();
			});
		}
	});
}

/**
 * Busca un registro.
 */
function commandAlgoSearchButtonClick() {
	core.search({
        'title': 'Busqueda de Algoritmos',
        'column1': 'Codigo',
        'field1': 'id',
        'column2': 'NOMBRE',
        'field2': 'nombre',
        'fieldId': 'id',
        'method': 'algoSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var id = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('algoLoad', {'id': id}, function(response) {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}
	
				var currentArea = core.tabs.getActiveTabArea('.main-work-area');
				core.form.setData(currentArea, response.data);
				core.form.setState(currentArea, core.form.state.showing);
			});
		}
	});
}

/**
 * Muestra el grid con los 5 ultimos registros.
 */
function algoShowLast() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	var params = {tableName: 'algo'};
	core.apiFunction('getLast5Records', params, function(response) {
		var gridStructure = {
			'tableTitle': 'Ultimos 5 registros ingresados',
			'columns': [
				{'title': 'ID', 'field': 'id', 'width': '50px', 'type': 'number', 'thousandSep': true, 'dataAlign': 'right'},
				{'title': 'NOMBRE', 'field': 'nombre', 'width': '250px', 'type': 'string'}
			],
			'rows': response.data,
			'showMaxRows': 5,
			'onClick': function(t) {
				core.showLoading();
				core.apiFunction('algoLoad', {'id': t.id}, function(response) {
					core.hideLoading();
					if (!response.status) {
						core.showMessage(response.message, 4, core.color.error);
						return;
					}
					var currentArea = core.tabs.getActiveTabArea('.main-work-area');
					core.form.setData(currentArea, response.data);
					core.form.setState(currentArea, core.form.state.showing);
				});
			}
		};

		core.grid.build($(".algoLast", currentArea), gridStructure);
	});
}

/**
 * On Load.
 */
$(() => {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    core.linkNativeEvents(currentArea);

	$('.commandAddButton', currentArea).unbind('click');
	$('.commandAddButton', currentArea).click(() => {
		commandAlgoAddButtonClick();
	});
	$('.commandEditButton', currentArea).unbind('click');
	$('.commandEditButton', currentArea).click(() => {
		commandAlgoEditButtonClick();
	});
	$('.commandSaveButton', currentArea).unbind('click');
	$('.commandSaveButton', currentArea).click(() => {
		commandAlgoSaveButtonClick();
	});
	$('.commandCancelButton', currentArea).unbind('click');
	$('.commandCancelButton', currentArea).click(() => {
		commandAlgoCancelButtonClick();
	});
	$('.commandDeleteButton', currentArea).unbind('click');
	$('.commandDeleteButton', currentArea).click(() => {
		commandAlgoDeleteButtonClick();
	});

	$('.commandSearchButton', currentArea).unbind('click');
	$('.commandSearchButton', currentArea).click(() => {
		commandAlgoSearchButtonClick();
	});

    algoShowLast();

	core.form.setState(currentArea, core.form.state.noShow);
});
