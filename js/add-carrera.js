
/**
 * Busca un jinete.
 */
function addCarreraJineteSearchButtonClick() {
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
            core.apiFunction('jinetesLoad', {'id': id}, (response) => {
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
 * Guarda una carrera.
 */
function addCarreraSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));
    
    core.showLoading();
    core.apiFunction('carrerasSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);
        core.form.dialog.close();
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
 * Busca si la fecha y el codigo de la carrera ya se encuentra registrada
 * para tomar la distancia y el tiempo del ganador.
 */
function addCarreraSeekCarrera() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    // Si la fecha o el codigo de la carrera estan vacios regresa.
    if (r.fecha == '' || r.codigo == '') {
        return;
    }

    var params = {
        fecha: r.fecha,
        codigo: r.codigo
    };

    core.showLoading();
    core.apiFunction('seekCarrera', params, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var data = response.data;
        if (Object.keys(data).length > 0) {
            r.distancia = data[0].distancia;
            r.tiempog = data[0].tiempog;
            var cnt = '#' + core.form.dialog.getCurrent();
            core.form.setData(cnt, r);
        }
    });
}

/**
 * Copia el tiempo del ganador si pfinal = 1.
 */
function addCarreraCopiaTiempoGanador() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    if (parseInt(r.pfinal) == 1) {
        r.tiempoe = r.tiempog;
        core.form.setData(cnt, r);
    }
}

/**
 * On Load.
 */
$(() => {
    var cnt = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(cnt);
    
    $('.addCarreraJineteSearchButton', cnt).unbind('click');
    $('.addCarreraJineteSearchButton', cnt).click(() => {
        addCarreraJineteSearchButtonClick();
    });

    $('.addCarreraJineteAddButton', cnt).unbind('click');
    $('.addCarreraJineteAddButton', cnt).click(() => {
        core.form.dialog.show('./add-jinete.php', {});
    });

    $('.addCarreraSaveButton', cnt).unbind('click');
    $('.addCarreraSaveButton', cnt).click(() => {
        addCarreraSaveButtonClick();
    });

    $('.addCarreraCloseButton', cnt).unbind('click');
    $('.addCarreraCloseButton', cnt).click(() => {
        core.form.dialog.close();
    });

    $('[name="fecha"]', cnt).unbind('blur');
    $('[name="fecha"]', cnt).blur(() => {
        addCarreraSeekCarrera();
    });

    $('[name="codigo"]', cnt).unbind('blur');
    $('[name="codigo"]', cnt).blur(() => {
        addCarreraSeekCarrera();
    });

    $('[name="tiempog"]', cnt).unbind('blur');
    $('[name="tiempog"]', cnt).blur(() => {
        addCarreraCopiaTiempoGanador();
    });

    var params = core.data.restore(cnt, 'params');
    core.form.setData(cnt, params);
})
