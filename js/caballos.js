
/**
 * Coloca el formulario en modo edicion para agregar.
 */
function commandCaballosAddButtonClick() {
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
function commandCaballosEditButtonClick() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	// Guarda los valores del registro actual.
	core.data.save(currentArea, 'backup', core.form.getData(currentArea));

	// Coloca el formulario en modo edicion.
	core.form.setState(currentArea, core.form.state.editing);
}

/**
 * Guarda el registro actual.
 */
function commandCaballosSaveButtonClick() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	// Toma el registro desde los controles del formulario.
	var r = core.transform2Json(core.form.getData(currentArea));

	// Ejecuta la funcion.
	core.showLoading();
	core.apiFunction('caballosSave', r, (response) => {
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

		caballosShowLast();
	});
}

/**
 * Cancela la edicion del registro actual.
 */
function commandCaballosCancelButtonClick() {
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
function commandCaballosDeleteButtonClick() {
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
			core.apiFunction('caballosDelete', {'id': r.id}, (response) => {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}

				core.showMessage(response.message, 4, core.color.success);
				core.form.setData(currentArea, core.form.getData(currentArea, true));
				core.form.setState(currentArea, core.form.state.noShow);
				caballosShowLast();
			});
		}
	});
}

/**
 * Busca un registro.
 */
function commandCaballosSearchButtonClick() {
	core.search({
        'title': 'Busqueda de Caballos',
        'column1': 'Codigo',
        'field1': 'id',
        'column2': 'NOMBRE',
        'field2': 'nombre',
        'fieldId': 'id',
        'method': 'caballosSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var id = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('caballosLoad', {'id': id}, function(response) {
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
function caballosShowLast() {
	var currentArea = core.tabs.getActiveTabArea('.main-work-area');

	var params = {tableName: 'caballos'};
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
				core.apiFunction('caballosLoad', {'id': t.id}, function(response) {
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

		core.grid.build($(".caballosLast", currentArea), gridStructure);
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
		commandCaballosAddButtonClick();
	});
	$('.commandEditButton', currentArea).unbind('click');
	$('.commandEditButton', currentArea).click(() => {
		commandCaballosEditButtonClick();
	});
	$('.commandSaveButton', currentArea).unbind('click');
	$('.commandSaveButton', currentArea).click(() => {
		commandCaballosSaveButtonClick();
	});
	$('.commandCancelButton', currentArea).unbind('click');
	$('.commandCancelButton', currentArea).click(() => {
		commandCaballosCancelButtonClick();
	});
	$('.commandDeleteButton', currentArea).unbind('click');
	$('.commandDeleteButton', currentArea).click(() => {
		commandCaballosDeleteButtonClick();
	});

	$('.commandSearchButton', currentArea).unbind('click');
	$('.commandSearchButton', currentArea).click(() => {
		commandCaballosSearchButtonClick();
	});

    caballosShowLast();

	core.form.setState(currentArea, core.form.state.noShow);
});
