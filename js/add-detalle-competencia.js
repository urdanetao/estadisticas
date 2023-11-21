
/**
 * Busca un caballo.
 */
function caballosSearchClick() {
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
	
				var cnt = '#' + core.form.dialog.getCurrent();
                var r = core.transform2Json(core.form.getData(cnt));
                r.idcab = response.data.id;
                r.nomcab = response.data.nombre;
                core.form.setData(cnt, r);
			});
		}
	});
}

/**
 * Busca un jinete.
 */
function jinetesSearchClick() {
    core.search({
        'title': 'Busqueda de Jinetes',
        'column1': 'Codigo',
        'field1': 'id',
        'column2': 'NOMBRE',
        'field2': 'nombre',
        'fieldId': 'id',
        'method': 'jinetesSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var id = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('jinetesLoad', {'id': id}, function(response) {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}
	
				var cnt = '#' + core.form.dialog.getCurrent();
                var r = core.form.getData(cnt);
                r.idjin = response.data.id;
                r.nomjin = response.data.nombre;
                core.form.setData(cnt, r);
			});
		}
	});
}

/**
 * Busca un preparador.
 */
function preparadoresSearchClick() {
    core.search({
        'title': 'Busqueda de Preparadores',
        'column1': 'Codigo',
        'field1': 'id',
        'column2': 'NOMBRE',
        'field2': 'nombre',
        'fieldId': 'id',
        'method': 'preparadoresSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var id = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('preparadoresLoad', {'id': id}, function(response) {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}
	
				var cnt = '#' + core.form.dialog.getCurrent();
                var r = core.form.getData(cnt);
                r.idprep = response.data.id;
                r.nomprep = response.data.nombre;
                core.form.setData(cnt, r);
			});
		}
	});
}

/**
 * Guarda el detalle de la competencia.
 */
function addDetalleCompetenciaSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    core.showLoading();
    core.apiFunction('detalleCompetenciaSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);

        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        var competencia = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));
        
        detalleCompetenciasLoad(competencia.id);
        core.form.dialog.close();
    });
}

/**
 * Maneja la seleccion del caballo.
 */
function txbCaballoSearchText(e, text) {
    if (text.length == 0) {
        $(e).find('.txbSearchBox').html('');
        $(e).find('.txbSearchBox').css('display', 'none');
        return;
    }

    core.apiFunction('caballosSearch', {'textToFind': text}, (response) => {
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
        }

        d = response.data;

        var html = '<div class="searchItemBox">';
        for (var i = 0; i < Object.keys(d).length; i++) {
            html +=
                '<div class="searchItem hideText">' +
                    '<div>' +
                        '<input type="text" class="txb" name="id" value="' + d[i].id + '" hidden>' +
                    '</div>' +
                    '<div>' +
                        '<input type="text" class="txb" name="nombre" value="' + d[i].nombre + '" hidden>' +
                    '</div>' +
                    '<div>' +
                        '<span>' + d[i].nombre + '</span>' +
                    '</div>' +
                '</div>';
        }

        html += '</div>';

        // Agrega el resultado de la busqueda al cuadro de resultados.
        $(e).find('.txbSearchBox').html(html);

        // Muestra u oculta el cuadro de resultados.
        if ( Object.keys(d).length == 0) {
            $(e).find('.txbSearchBox').css('display', 'none');
        } else {
            $(e).find('.txbSearchBox').css('display', 'block');

            // Evento click en el item.
            $(e).find('.txbSearchBox').find('.searchItem').unbind('click');
            $(e).find('.txbSearchBox').find('.searchItem').click((e) => {
                var r = core.transform2Json(core.form.getData($(e.currentTarget)));
                
                // Toma el elemento padre.
                var parent = $(e.currentTarget).closest('.search');

                var data = {
                    idcab: r.id,
                    nomcab: r.nombre
                };
                core.form.setData('.detalleCompetenciaBody', data);

                // Blanquea y oculta los resultados de la busqueda.
                $(parent).find('.txbSearchBox').html('');
                $(parent).find('.txbSearchBox').css('display', 'none');
            })
        }
    });
}

/**
 * Maneja la seleccion del jinete.
 */
function txbJineteSearchText(e, text) {
    if (text.length == 0) {
        $(e).find('.txbSearchBox').html('');
        $(e).find('.txbSearchBox').css('display', 'none');
        return;
    }

    core.apiFunction('jinetesSearch', {'textToFind': text}, (response) => {
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
        }

        d = response.data;

        var html = '<div class="searchItemBox">';
        for (var i = 0; i < Object.keys(d).length; i++) {
            html +=
                '<div class="searchItem hideText">' +
                    '<div>' +
                        '<input type="text" class="txb" name="id" value="' + d[i].id + '" hidden>' +
                    '</div>' +
                    '<div>' +
                        '<input type="text" class="txb" name="nombre" value="' + d[i].nombre + '" hidden>' +
                    '</div>' +
                    '<div>' +
                        '<span>' + d[i].nombre + '</span>' +
                    '</div>' +
                '</div>';
        }

        html += '</div>';

        // Agrega el resultado de la busqueda al cuadro de resultados.
        $(e).find('.txbSearchBox').html(html);

        // Muestra u oculta el cuadro de resultados.
        if ( Object.keys(d).length == 0) {
            $(e).find('.txbSearchBox').css('display', 'none');
        } else {
            $(e).find('.txbSearchBox').css('display', 'block');

            // Evento click en el item.
            $(e).find('.txbSearchBox').find('.searchItem').unbind('click');
            $(e).find('.txbSearchBox').find('.searchItem').click((e) => {
                var r = core.transform2Json(core.form.getData($(e.currentTarget)));
                
                // Toma el elemento padre.
                var parent = $(e.currentTarget).closest('.search');

                var data = {
                    idjin: r.id,
                    nomjin: r.nombre
                };

                var cnt = '#' + core.form.dialog.getCurrent();
                core.form.setData(cnt, data);

                // Blanquea y oculta los resultados de la busqueda.
                $(parent).find('.txbSearchBox').html('');
                $(parent).find('.txbSearchBox').css('display', 'none');
            })
        }
    });
}

/**
 * Maneja la seleccion del preparador.
 */
function txbPreparadorSearchText(e, text) {
    if (text.length == 0) {
        $(e).find('.txbSearchBox').html('');
        $(e).find('.txbSearchBox').css('display', 'none');
        return;
    }

    core.apiFunction('preparadoresSearch', {'textToFind': text}, (response) => {
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
        }

        d = response.data;

        var html = '<div class="searchItemBox">';
        for (var i = 0; i < Object.keys(d).length; i++) {
            html +=
                '<div class="searchItem hideText">' +
                    '<div>' +
                        '<input type="text" class="txb" name="id" value="' + d[i].id + '" hidden>' +
                    '</div>' +
                    '<div>' +
                        '<input type="text" class="txb" name="nombre" value="' + d[i].nombre + '" hidden>' +
                    '</div>' +
                    '<div>' +
                        '<span>' + d[i].nombre + '</span>' +
                    '</div>' +
                '</div>';
        }

        html += '</div>';

        // Agrega el resultado de la busqueda al cuadro de resultados.
        $(e).find('.txbSearchBox').html(html);

        // Muestra u oculta el cuadro de resultados.
        if ( Object.keys(d).length == 0) {
            $(e).find('.txbSearchBox').css('display', 'none');
        } else {
            $(e).find('.txbSearchBox').css('display', 'block');

            // Evento click en el item.
            $(e).find('.txbSearchBox').find('.searchItem').unbind('click');
            $(e).find('.txbSearchBox').find('.searchItem').click((e) => {
                var r = core.transform2Json(core.form.getData($(e.currentTarget)));
                
                // Toma el elemento padre.
                var parent = $(e.currentTarget).closest('.search');

                var data = {
                    idprep: r.id,
                    nomprep: r.nombre
                };
                core.form.setData('.detalleCompetenciaBody', data);

                // Blanquea y oculta los resultados de la busqueda.
                $(parent).find('.txbSearchBox').html('');
                $(parent).find('.txbSearchBox').css('display', 'none');
            })
        }
    });
}

/**
 * On Load.
 */
$(() => {
    var cnt = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(cnt);

    $('.caballosSearchButton', cnt).unbind('click');
    $('.caballosSearchButton', cnt).click(() => {
        caballosSearchClick();
    });

    $('.caballosAddButton', cnt).unbind('click');
    $('.caballosAddButton', cnt).click(() => {
        core.form.dialog.show('./add-caballo.php', {});
    });

    $('.jinetesAddButton', cnt).unbind('click');
    $('.jinetesAddButton', cnt).click(() => {
        core.form.dialog.show('./add-jinete.php', {});
    });

    $('.preparadoresAddButton', cnt).unbind('click');
    $('.preparadoresAddButton', cnt).click(() => {
        core.form.dialog.show('./add-preparador.php', {});
    });

    $('.jinetesSearchButton', cnt).unbind('click');
    $('.jinetesSearchButton', cnt).click(() => {
        jinetesSearchClick();
    });

    $('.preparadoresSearchButton', cnt).unbind('click');
    $('.preparadoresSearchButton', cnt).click(() => {
        preparadoresSearchClick();
    });

    $('.addDetalleCompetenciaSaveButton', cnt).unbind('click');
    $('.addDetalleCompetenciaSaveButton', cnt).click(() => {
        addDetalleCompetenciaSaveButtonClick();
    });

    $('.addDetalleCompetenciaCancelButton', cnt).unbind('click');
    $('.addDetalleCompetenciaCancelButton', cnt).click(() => {
        core.form.dialog.close();
    });

    var params = core.data.restore(cnt, 'params');
    core.form.setData(cnt, params);
});
