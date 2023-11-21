
/**
 * Muestra los datos en el historico.
 */
function historicoShowData(data) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var html = '', d;

    // Linea de titulos.
    html +=
        '<div class="itemTitleLine">' +
            '<div class="titleFecha">' +
                '<span>FECHA</span>' +
            '</div>' +
            '<div class="titleCodigo">' +
                '<span>CRR.</span>' +
            '</div>' +
            '<div class="titleDistancia">' +
                '<span>DIST.</span>' +
            '</div>' +
            '<div class="titleJinete">' +
                '<span>JINETE</span>' +
            '</div>' +
            '<div class="titlePeso">' +
                '<span>Kg</span>' +
            '</div>' +
            '<div class="titleDividendo">' +
                '<span>Div.</span>' +
            '</div>' +
            '<div class="title1000300">' +
                '<span>1000/300</span>' +
            '</div>' +
            '<div class="titlePFinal">' +
                '<span>Lleg.</span>' +
            '</div>' +
            '<div class="titleCuerpos">' +
                '<span>Cpos.</span>' +
            '</div>' +
            '<div class="titleTiempoG">' +
                '<span>T.Gan.</span>' +
            '</div>' +
            '<div class="titleTiempoE">' +
                '<span>T.Eje.</span>' +
            '</div>' +
            '<div class="titleRating">' +
                '<span>TTC</span>' +
            '</div>' +
        '</div>';

    // Si no hay datos que mostrar.
    if (Object.keys(data).length == 0) {
        html +=
            '<div>' +
                '<div class="vsep10"></div>' +
                '<div class="vsep10"></div>' +
                '<div class="flex flex-hcenter historicoNoData">' +
                    '<span>No hay datos que mostrar</span>' +
                '</div>' +
            '</div>';
    } else {
        html += '<div class="itemLineDetailBox">';

        // Si no tiene carreras registradas.
        if (Object.keys(data).length == 0) {
            html +=
                '<div class="debutanteBox">' +
                    '<span>D E B U T A N T E<span>' +
                '</div>';
        } else {
            for (var i = 0; i < Object.keys(data).length; i++) {
                // Establece el color para el puesto de llegada.
                if (parseInt(data[i].pfinal) == 0 || parseInt(data[i].pfinal) > 5) {
                    clase = 'alerta';
                } else if (parseInt(data[i].pfinal) == 1) {
                    clase = 'primero';
                } else {
                    clase = '';
                }

                html +=
                    '<div class="itemLineDetailLine">' +
                        '<div class="carreraData">' +
                            '<input type="text" class="txb" name="id" value="' + data[i].id + '" hidden>' +
                            '<input type="date" class="txb" name="fecha" value="' + data[i].fecha + '" hidden>' +
                            '<input type="text" class="txb" name="codigo" value="' + data[i].codigo + '" hidden>' +
                            '<input type="text" class="txb" name="idcab" value="' + data[i].idcab + '" hidden>' +
                            '<input type="text" class="txb" name="distancia" value="' + data[i].distancia + '" hidden>' +
                            '<input type="text" class="txb" name="idjin" value="' + data[i].idjin + '" hidden>' +
                            '<input type="text" class="txb" name="nomjin" value="' + data[i].nomjin + '" hidden>' +
                            '<input type="text" class="txb" name="pesojin" value="' + data[i].pesojin + '" hidden>' +
                            '<input type="text" class="txb txb-num d2 m" name="dividendo" value="' + data[i].dividendo + '" hidden>' +
                            '<input type="text" class="txb txb-num" name="p1000" value="' + data[i].p1000 + '" hidden>' +
                            '<input type="text" class="txb txb-num" name="p300" value="' + data[i].p300 + '" hidden>' +
                            '<input type="text" class="txb txb-num" name="pfinal" value="' + data[i].pfinal + '" hidden>' +
                            '<input type="text" class="txb txb-num" name="cuerpos" value="' + data[i].cuerpos + '" hidden>' +
                            '<input type="text" class="txb txb-num d2 m" name="tiempog" value="' + data[i].tiempog + '" hidden>' +
                            '<input type="text" class="txb txb-num d2 m" name="tiempoe" value="' + data[i].tiempoe + '" hidden>' +
                            '<input type="text" class="txb txb-num" name="rating" value="' + data[i].rating + '" hidden>' +
                        '</div>' +
                        '<div class="colFecha">' +
                            '<span>' + core.format.formatDate(data[i].fecha) + '</span>' +
                        '</div>' +
                        '<div class="colCodigo">' +
                            '<span>' + data[i].codigo + '</span>' +
                        '</div>' +
                        '<div class="colDistancia">' +
                            '<span>' + data[i].distancia + '</span>' +
                        '</div>' +
                        '<div class="colNomJin hideText">' +
                            '<span>' + data[i].nomjin + '</span>' +
                        '</div>' +
                        '<div class="colPesoJin">' +
                            '<span>' + core.format.numberFormat(data[i].pesojin, 1, false) + '</span>' +
                        '</div>' +
                        '<div class="colDividendo">' +
                            '<span>' + core.format.numberFormat(data[i].dividendo, 2, true) + '</span>' +
                        '</div>' +
                        '<div class="colP1000">' +
                            '<span>' + data[i].p1000 + '</span>' +
                        '</div>' +
                        '<div class="colP300">' +
                            '<span>' + data[i].p300 + '</span>' +
                        '</div>' +
                        '<div class="colPFinal">' +
                            '<span class="' + clase + '">' + data[i].pfinal + '</span>' +
                        '</div>' +
                        '<div class="colCuerpos">' +
                            '<span>' + core.format.numberFormat(data[i].cuerpos, 2, false) + '</span>' +
                        '</div>' +
                        '<div class="colTiempoG">' +
                            '<span>' + core.format.numberFormat(data[i].tiempog, 2, false) + '</span>' +
                        '</div>' +
                        '<div class="colTiempoE">' +
                            '<span>' + core.format.numberFormat(data[i].tiempoe, 2, false) + '</span>' +
                        '</div>' +
                        '<div class="colRating">' +
                            '<span>' + data[i].rating + '</span>' +
                        '</div>' +
                    '</div>';
            }

            html += '</div>';
        }
    }

    // Agrega el contenido html.
    $('.historicoBox', currentArea).html(html);

    $('.itemLineDetailLine', $('.historicoBox', currentArea)).unbind('click');
    $('.itemLineDetailLine', $('.historicoBox', currentArea)).click((o) => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');

        // Guarda el objeto contenedor de la linea.
        var obj = $(o.currentTarget);
        core.data.save(currentArea, 'itemSelected', obj);

        // Llama al formulario de seleccion de opcion.
        core.form.dialog.show('./option-select.php', {}, carrerasOptionHandler);
    });
}


/**
 * Funcion para manejar la respues de las opciones para una carrera.
 */
function carrerasOptionHandler() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Toma la opcion seleccionada.
    var option = core.form.dialog.getBackwardData();

    // Toma el registro previamente seleccionado.
    var obj = core.data.restore(currentArea, 'itemSelected');

    // Toma los datos del ejemplar, jinete, peso, efectividad y entrenador.
    var r = core.transform2Json(core.form.getData($('.historicoDataBox', currentArea)))

    // Toma los datos del item seleccionado.
    d = core.form.getData(obj);

    // Agrega numero y el nombre del caballo.
    d.numero = '0';
    d.nomcab = r.nomcab;

    switch (option) {
        case 'E':
            core.form.dialog.show('./add-carrera.php', d, btnHistoricoBuscarClick);
            break;
        case 'D':
            core.showConfirm({
                'icon': 'icon icon-bin',
                'title': 'Confirmar Eliminar Carrera',
                'message': 'Se dispone a eliminar esta carrera, esta acción no se puede revertir, ¿Esta seguro?',
                'callbackOk': () => {
                    core.showLoading();
                    core.apiFunction('carrerasDelete', {id: d.id}, (response) => {
                        core.hideLoading();
                        if (!response.status) {
                            core.showMessage(response.message, 4, core.color.error);
                            return;
                        }
                        core.showMessage(response.message, 4, core.color.success);
                        btnHistoricoBuscarClick();
                    });
                }
            });            
            break;
    }
}


/**
 * Busca el historico de carreras de un ejemplar.
 */
function btnHistoricoBuscarClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var r = core.transform2Json(core.form.getData($('.historicoDataBox', currentArea)))

    core.showLoading();
    core.apiFunction('historicoLoad', r, (response) => {
        core.hideLoading();

        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return
        }

        core.showMessage(response.message, 4, core.color.success);

        historicoShowSummaryTable(response.data);
        historicoShowData(response.data);
    });
}


/**
 * Maneja la seleccion del caballo.
 */
function historicoCaballoSearchText(e, text) {
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
                core.form.setData('.historicoDataBox', data);

                // Blanquea y oculta los resultados de la busqueda.
                $(parent).find('.txbSearchBox').html('');
                $(parent).find('.txbSearchBox').css('display', 'none');
            })
        }
    });
}


/**
 * Limpia el ejemplar seleccionado.
 */
function btnHistoricoClearEjemplarClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var r = core.transform2Json(core.form.getData($('.historicoDataBox', currentArea)))
    r.idcab = '';
    r.nomcab = '';
    core.form.setData(currentArea, r);
    historicoShowData([]);
}


/**
 * Limpia la distancia establecida en la busqueda.
 */
function btnHistoricoClearDistanciaClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var r = core.transform2Json(core.form.getData($('.historicoDataBox', currentArea)))
    r.distancia = 0;
    core.form.setData(currentArea, r);
    btnHistoricoBuscarClick();
}


/**
 * Abre la ventana de busqueda de ejemplares.
 */
function btnHistoricoSearchCaballoClick() {
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
                var r = core.transform2Json(core.form.getData('.historicoDataBox', currentArea));
                r.idcab = response.data.id;
                r.nomcab = response.data.nombre;
				core.form.setData(currentArea, r);
				btnHistoricoBuscarClick();
			});
		}
	});
}


/**
 * Abre el formulario para agregar una carrera.
 */
function historicoBtnAgregarCarreraClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var r = core.transform2Json(core.form.getData('.historicoDataBox', currentArea));

    if (r.idcab == '') {
        core.showMessage('Primero debe seleccionar un caballo', 4, core.color.info);
        return;
    }

    var params = {
        id: '',
        numero: '0',
        idcab: r.idcab,
        nomcab: r.nomcab
    };
    core.form.dialog.show('./add-carrera.php', params, btnHistoricoBuscarClick);
}


/**
 * Genera el titulo de la tabla de resumen.
 */
function historicoGetHTMLTableTitle() {
    var html =
        '<tr class="historicoRowTitle">' +
            '<td>' +
                '<div>' +
                    '<span class="lbl">Distancia</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div>' +
                    '<span class="lbl">Mejor T.</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div>' +
                    '<span class="lbl">Peor T.</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div>' +
                    '<span class="lbl">T. Prom.</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div>' +
                    '<span class="lbl">Mejor R.</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div>' +
                    '<span class="lbl">Peor R.</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div>' +
                    '<span class="lbl">R. Prom.</span>' +
                '</div>' +
            '</td>' +
        '</tr>';

    return html;
}


/**
 * Muestra la tabla de resumen.
 */
function historicoShowSummaryTable(data) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var html = historicoGetHTMLTableTitle();
    var distancia, d, mt, pt, tt, tp, mr, pr, rt, rp, ct, cr, tiempoe, rating;
    var total = Object.keys(data).length;
    var indicted = [], ii = 0;
    var resumen = [], ri = 0;

    for (var i = 0; i < total; i++) {
        distancia = parseInt(data[i].distancia);

        if (indicted.includes(distancia)) {
            continue;
        }

        ct = 0;     // Contador de tiempos.
        mt = 0;     // Mejor tiempo.
        pt = 0;     // Peor tiempo.
        tt = 0;     // Tiempo total.
        tp = 0;     // Tiempo promedio.
        cr = 0;     // Contador de ratings.
        mr = 0;     // Mejor rating.
        pr = 0;     // Peor rating.
        rt = 0;     // Rating total.
        rp = 0;     // Rating promedio.

        for (var k = 0; k < total; k++) {
            d = parseInt(data[k].distancia);

            if (d != distancia) {
                continue;
            }

            tiempoe = parseFloat(data[k].tiempoe);
            if (tiempoe.toFixed(1) > 0) {
                if (mt == 0 || mt > tiempoe) {
                    mt = tiempoe;
                }
                if (pt < tiempoe) {
                    pt = tiempoe;
                }
                tt += tiempoe;
                ct++;
            }

            rating = parseInt(data[k].rating);
            if (rating > 0) {
                if (mr == 0 || mr > rating) {
                    mr = rating;
                }
                if (pr < rating) {
                    pr = rating;
                }
                rt += rating;
                cr++;
            }
        }

        indicted[ii] = distancia;
        ii++;

        if (ct > 0) {
            tp = (tt / ct).toFixed(1);
        }

        if (cr > 0) {
            rp = (rt / cr).toFixed(0);
        }

        resumen[ri] = {};
        resumen[ri].distancia = distancia;
        resumen[ri].mt = mt;
        resumen[ri].pt = pt;
        resumen[ri].tp = tp;
        resumen[ri].mr = mr;
        resumen[ri].pr = pr;
        resumen[ri].rp = rp;
        ri++
    }

    resumen.sort((a, b) => a.distancia - b.distancia);

    for (var i = 0; i < Object.keys(resumen).length; i++) {
        html +=
            '<tr class="historicoRowData">' +
                '<td>' +
                    '<div>' +
                        '<span class="lbl">' + core.format.numberFormat(resumen[i].distancia, 0, true) + '</span>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<div>' +
                        '<span class="lbl">' + core.format.numberFormat(resumen[i].mt, 1, false) + '</span>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<div>' +
                        '<span class="lbl">' + core.format.numberFormat(resumen[i].pt, 1, false) + '</span>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<div>' +
                        '<span class="lbl">' + core.format.numberFormat(resumen[i].tp, 1, false) + '</span>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<div>' +
                        '<span class="lbl">' + core.format.numberFormat(resumen[i].mr, 0, false) + '</span>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<div>' +
                        '<span class="lbl">' + core.format.numberFormat(resumen[i].pr, 0, false) + '</span>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<div>' +
                        '<span class="lbl">' + core.format.numberFormat(resumen[i].rp, 0, false) + '</span>' +
                    '</div>' +
                '</td>' +
            '</tr>';
    }

    $('.historicoTablaResumen', currentArea).html(html);
}


/**
 * On load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    core.linkNativeEvents(currentArea);

    $('.btnHistoricoSearchCaballo', currentArea).unbind('click');
    $('.btnHistoricoSearchCaballo', currentArea).click(() => {
        btnHistoricoSearchCaballoClick();
    });

    $('.btnHistoricoClearEjemplar', currentArea).unbind('click');
    $('.btnHistoricoClearEjemplar', currentArea).click(() => {
        btnHistoricoClearEjemplarClick();
    });

    $('.btnHistoricoClearDistancia', currentArea).unbind('click');
    $('.btnHistoricoClearDistancia', currentArea).click(() => {
        btnHistoricoClearDistanciaClick();
    });

    $('.btnHistoricoBuscar', currentArea).unbind('click');
    $('.btnHistoricoBuscar', currentArea).click(() => {
        btnHistoricoBuscarClick();
    });

    $('.historicoBtnAgregarCarrera', currentArea).unbind('click');
    $('.historicoBtnAgregarCarrera', currentArea).click(() => {
        historicoBtnAgregarCarreraClick();
    });

    historicoShowSummaryTable([]);
    historicoShowData([]);
});
