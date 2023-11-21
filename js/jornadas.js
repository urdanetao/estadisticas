
/**
 * Agrega una jornada.
 */
function jornadasAddButtonClick() {
    core.form.dialog.show('./add-jornada.php', {});
}

/**
 * Agrega una competencia.
 */
function competenciasAddButtonClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    
    if ($('.jornadaItemSelected', $('.jornadasList', currentArea)).length == 0) {
        core.showMessage('Debe seleccionar una jornada', 4, core.color.info);
        return;
    }

    var jornada = core.transform2Json(core.form.getData($('.jornadaItemSelected', $('.jornadasList', currentArea))));

    var r = {idparent: jornada.id, fecha: jornada.fecha};
    core.form.dialog.show('./add-competencia.php', r);
}

/**
 * Edita una competencia.
 */
function competenciasEditButtonClick(o) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Si no hay un elemento seleccionado.
    if ($('.competenciaItemSelected', $('.competenciasList', currentArea)).length == 0) {
        return;
    }

    // Toma los datos del elemento seleccionado.
    var r = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));

    // Toma el id de la competencia.
    var id = $(o.currentTarget).closest('.competenciasItem').find('input[name="id"]').val();

    // Si no esta misma competencia retorna.
    if (r.id != id) {
        return;
    }

    core.form.dialog.show('./add-competencia.php', r);
}

/**
 * Elimina una competencia.
 */
function competenciasDeleteButtonClick(o) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Si no hay un elemento seleccionado.
    if ($('.competenciaItemSelected', $('.competenciasList', currentArea)).length == 0) {
        return;
    }

    // Toma los datos del elemento seleccionado.
    var r = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));

    // Toma el id de la competencia.
    var id = $(o.currentTarget).closest('.competenciasItem').find('input[name="id"]').val();

    // Si no esta misma competencia retorna.
    if (r.id != id) {
        return;
    }

    core.showConfirm({
        'icon': 'icon icon-bin',
        'title': 'Confirmar Eliminar Competencia',
        'message': 'Se dispone a eliminar la competencia, esta acción no se puede revertir, ¿Esta seguro?',
        'callbackOk': () => {
            core.showLoading();
            core.apiFunction('competenciasDelete', {id: r.id}, (response) => {
                core.hideLoading();
                if (!response.status) {
                    core.showMessage(response.message, 4, core.color.error);
                    return;
                }
                core.showMessage(response.message, 4, core.color.success);
                competenciasLoad(r.idparent);
            });
        }
    });
}

/**
 * Edita una jornada.
 */
function jornadaItemEditButtonClick(o) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var item = $(o.currentTarget, currentArea).closest('.jornadaItem');
    var r = core.transform2Json(core.form.getData(item, currentArea));
    core.form.dialog.show('./add-jornada.php', r);
}

/**
 * Elimina una jornada.
 */
function jornadaItemDeleteButtonClick(o) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var item = $(o.currentTarget, currentArea).closest('.jornadaItem');
    var r = core.transform2Json(core.form.getData(item, currentArea));
    
    core.showConfirm({
        'icon': 'icon icon-bin',
        'title': 'Confirmar Eliminar Jornada',
        'message': 'Se dispone a eliminar la jornada y todas sus competencias, esta acción no se puede revertir, ¿Esta seguro?',
        'callbackOk': () => {
            core.showLoading();
            core.apiFunction('jornadasDelete', {id: r.id}, (response) => {
                core.hideLoading();
                if (!response.status) {
                    core.showMessage(response.message, 4, core.color.error);
                    return;
                }
                core.showMessage(response.message, 4, core.color.success);
                jornadasLoad();
                competenciasLoad(0);
            });
        }
    });
}

/**
 * Cuando se hace click en una competencia.
 */
function competenciasSelect(o) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var r = core.transform2Json(core.form.getData($(o.currentTarget, currentArea)));

    // Marca la competencia como seleccionada.
    $('.competenciasItem', $('.competenciasList', currentArea)).removeClass('competenciaItemSelected');
    $(o.currentTarget, currentArea).addClass('competenciaItemSelected');

    // Carga el detalle de la competencia.
    detalleCompetenciasLoad(r.id);
}

/**
 * Carga el detalle de la competencia.
 */
function detalleCompetenciasLoad(id) {
    core.showLoading();
    core.apiFunction('competenciasDetalleLoad', {'id': id}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        jornadasShowCompetencia(response.data);
    });
}

/**
 * Devuelve una instancia vacia de una competencia.
 */
function jornadasGetEmptyData() {
    var d = {
        r: [],
        d: [],
        e: {
            fecha: '',
            descrip: '',
            codigo: '',
            distancia: ''
        }
    };
    return d;
}

/**
 * Muestra el detalle de una competencia.
 */
function jornadasShowCompetencia(data) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    var html = '', d;

    // Si no hay datos que mostrar.
    if (Object.keys(data.d).length == 0) {
        html +=
            '<div>' +
                '<div class="vsep10"></div>' +
                '<div class="vsep10"></div>' +
                '<div class="flex flex-hcenter jornadasNoData">' +
                    '<span>No hay datos que mostrar</span>' +
                '</div>' +
            '</div>';
    } else {
        // Linea de titulos.
        html +=
            '<div class="itemTitleLine">' +
                '<div class="titleNumero">' +
                    '<span>No</span>' +
                '</div>' +
                '<div class="titleEjemplar">' +
                    '<span>EJEMPLAR</span>' +
                '</div>' +
                '<div class="titleJinetePeso">' +
                    '<span>JINETE/PESO</span>' +
                '</div>' +
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
    
        // Linea con la informacion de cada ejemplar.
        var tiempo, mejorTiempo = 0, tiempoId = '';
        for (var i = 0; i < Object.keys(data.r).length; i++) {
            var tiempo = parseFloat(data.r[i].tiempo);
            if (mejorTiempo == 0 || (tiempo > 0 && tiempo < mejorTiempo)) {
                mejorTiempo = tiempo;
                tiempoId = data.r[i].id;
            }
            
            var tscAlerta = '';
            var d = parseInt(core.getNumbers(data.r[i].diassincorrer));

            if (d >= 100) {
                tscAlerta = 'resaltado';
            } else if (d >= 30) {
                tscAlerta = 'warning';
            }

            html +=
                '<div class="itemLine">' +
                    '<div class="dcompetenciasItemData">' +
                        '<input class="txb" name="id" value="' + data.r[i].id + '" hidden>' +
                        '<input class="txb" name="idparent" value="' + data.r[i].idparent + '" hidden>' +
                        '<input class="txb" name="numero" value="' + data.r[i].numero + '" hidden>' +
                        '<input class="txb" name="idcab" value="' + data.r[i].idcab + '" hidden>' +
                        '<input class="txb" name="nomcab" value="' + data.r[i].nomcab + '" hidden>' +
                        '<input class="txb" name="idjin" value="' + data.r[i].idjin + '" hidden>' +
                        '<input class="txb" name="nomjin" value="' + data.r[i].nomjin + '" hidden>' +
                        '<input class="txb" name="pesojin" value="' + data.r[i].pesojin + '" hidden>' +
                        '<input class="txb" name="efectividadjin" value="' + data.r[i].efectividadjin + '" hidden>' +
                        '<input class="txb" name="idprep" value="' + data.r[i].idprep + '" hidden>' +
                        '<input class="txb" name="nomprep" value="' + data.r[i].nomprep + '" hidden>' +
                        '<input class="txb" name="tiempo" value="' + data.r[i].tiempo + '" hidden>' +
                        '<input class="txb" name="rating" value="' + data.r[i].rating + '" hidden>' +
                        '<input class="txb" name="diassincorrer" value="' + data.r[i].diassincorrer + '" hidden>' +
                        '<input class="txb" name="puntos" value="' + data.r[i].puntos + '" hidden>' +
                    '</div>' +
                    '<div class="itemLineNumero">' +
                        '<span>' + data.r[i].numero + '</span>' +
                    '</div>' +
                    '<div class="flex grupoDetalleCompetencia">' +
                        '<div class="itemLineHorseName">' +
                            '<div class="itemLineHorsePuntos">' +
                                '<span class="' + (parseInt(data.r[i].puntos) > 0 ? 'puntos' : '') + '">' + (parseInt(data.r[i].puntos) > 0 ? 'Puntos: ' + data.r[i].puntos : '') + '</span>' +
                            '</div>' +
                            '<div class="itemLineHorseEfectividad">' +
                                '<span>' + data.r[i].efectividadjin + '</span>' +
                            '</div>' +
                            '<span>' + data.r[i].nomcab + '</span>' +
                            '<div class="itemLineHorseDiasSinCorrer">' +
                                '<span class="' + tscAlerta + '">' + data.r[i].diassincorrer + '</span>' +
                            '</div>' +
                            '<div class="itemLineHorseTiempoRating">' +
                                '<span class="' + (parseFloat((data.r[i].tiempo)).toFixed(1) > parseFloat((data.pt[0].tiempog)).toFixed(1) ? 'alerta' : '') + '">' +
                                    (data.r[i].tcalc ? 'Calc. ' : '') +
                                    core.format.numberFormat(data.r[i].tiempo, 1, false) + '/' + core.format.numberFormat(data.r[i].rating, 0, false) +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="itemLineJinetePeso">' +
                            '<div class="itemLineNomJin hideText">' +
                                '<span>' + data.r[i].nomjin + '</span>' +
                            '</div>' +
                            '<div class="itemLinePesoJin">' +
                                '<span class="' + ((parseInt(data.r[i].pesojin) == 0 || parseInt(data.r[i].pesojin) >= 55) ? 'alerta' : '') + '">' + data.r[i].pesojin + '</span>' +
                            '</div>' +
                            '<div class="itemLineNomPrep hideText">' +
                                '<span>' + data.r[i].nomprep + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="itemLineDetailBox">';
            
            // Lineas con la informacion de las 4 ultimas carreras.
            d = data.d[i];

            if (Object.keys(d).length == 0) {
                html +=
                    '<div class="debutanteBox">' +
                        '<span>D E B U T A N T E<span>' +
                    '</div>';
            } else {
                var clase;
                for (var j = 0; j < Object.keys(d).length; j++) {
                    if (parseInt(d[j].pfinal) == 0 || parseInt(d[j].pfinal) > 5) {
                        clase = 'alerta';
                    } else if (parseInt(d[j].pfinal) == 1) {
                        clase = 'primero';
                    } else {
                        clase = '';
                    }
                    html +=
                        '<div class="itemLineDetailLine">' +
                            '<div class="carreraData">' +
                                '<input type="text" class="txb" name="id" value="' + d[j].id + '" hidden>' +
                                '<input type="date" class="txb" name="fecha" value="' + d[j].fecha + '" hidden>' +
                                '<input type="text" class="txb" name="codigo" value="' + d[j].codigo + '" hidden>' +
                                '<input type="text" class="txb" name="idcab" value="' + d[j].idcab + '" hidden>' +
                                '<input type="text" class="txb" name="distancia" value="' + d[j].distancia + '" hidden>' +
                                '<input type="text" class="txb" name="idjin" value="' + d[j].idjin + '" hidden>' +
                                '<input type="text" class="txb" name="nomjin" value="' + d[j].nomjin + '" hidden>' +
                                '<input type="text" class="txb" name="pesojin" value="' + d[j].pesojin + '" hidden>' +
                                '<input type="text" class="txb txb-num d2 m" name="dividendo" value="' + d[j].dividendo + '" hidden>' +
                                '<input type="text" class="txb txb-num" name="p1000" value="' + d[j].p1000 + '" hidden>' +
                                '<input type="text" class="txb txb-num" name="p300" value="' + d[j].p300 + '" hidden>' +
                                '<input type="text" class="txb txb-num" name="pfinal" value="' + d[j].pfinal + '" hidden>' +
                                '<input type="text" class="txb txb-num d2" name="cuerpos" value="' + d[j].cuerpos + '" hidden>' +
                                '<input type="text" class="txb txb-num d2" name="tiempog" value="' + d[j].tiempog + '" hidden>' +
                                '<input type="text" class="txb txb-num d2" name="tiempoe" value="' + d[j].tiempoe + '" hidden>' +
                                '<input type="text" class="txb txb-num" name="rating" value="' + d[j].rating + '" hidden>' +
                            '</div>' +
                            '<div class="colFecha">' +
                                '<span>' + core.format.formatDate(d[j].fecha) + '</span>' +
                            '</div>' +
                            '<div class="colCodigo">' +
                                '<span>' + d[j].codigo + '</span>' +
                            '</div>' +
                            '<div class="colDistancia">' +
                                '<span>' + d[j].distancia + '</span>' +
                            '</div>' +
                            '<div class="colNomJin hideText">' +
                                '<span>' + d[j].nomjin + '</span>' +
                            '</div>' +
                            '<div class="colPesoJin">' +
                                '<span>' + core.format.numberFormat(d[j].pesojin, 1, false) + '</span>' +
                            '</div>' +
                            '<div class="colDividendo">' +
                                '<span>' + core.format.numberFormat(d[j].dividendo, 2, true) + '</span>' +
                            '</div>' +
                            '<div class="colP1000">' +
                                '<span>' + d[j].p1000 + '</span>' +
                            '</div>' +
                            '<div class="colP300">' +
                                '<span>' + d[j].p300 + '</span>' +
                            '</div>' +
                            '<div class="colPFinal">' +
                                '<span class="' + clase + '">' + d[j].pfinal + '</span>' +
                            '</div>' +
                            '<div class="colCuerpos">' +
                                '<span>' + core.format.numberFormat(d[j].cuerpos, 2, false) + '</span>' +
                            '</div>' +
                            '<div class="colTiempoG">' +
                                '<span>' + core.format.numberFormat(d[j].tiempog, 2, false) + '</span>' +
                            '</div>' +
                            '<div class="colTiempoE">' +
                                '<span>' + core.format.numberFormat(d[j].tiempoe, 2, false) + '</span>' +
                            '</div>' +
                            '<div class="colRating">' +
                                '<span>' + d[j].rating + '</span>' +
                            '</div>' +
                        '</div>';
                }
            }
    
            html +=
                    '</div>' +
                    '<div class="itemButtonsBox">' +
                        '<div class="hsep10"></div>' +
                        '<button class="btn btn-info mini-btn carrerasAddButton">' +
                            '<span class="icon icon-plus"></span>' +
                        '</button>' +
                    '</div>' +
                '</div>';
        }
    
        // Agrega la ventana.
        html =
            '<div class="vsep10"></div>' +
            '<div class="vsep10"></div>' +
            '<div class="flex flex-hcenter">' +
                '<div class="window">' +
                    '<div class="windowTitle">' +
                        '<h6>Retrospecto</h6>' +
                    '</div>' +
                    '<div class="windowBox">' +
                        '<div>' +
                            '<fieldset>' +
                                '<legend>Mejor tiempo registrado para la distancia</legend>' +
                                '<div class="flex">' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Fecha</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="date" class="txb" value="' + data.mt[0].fecha + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="date" class="txb" value="' + data.mt[1].fecha + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="date" class="txb" value="' + data.mt[2].fecha + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="date" class="txb" value="' + data.mt[3].fecha + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="date" class="txb" value="' + data.mt[4].fecha + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Dist.</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0 m" name="mtDistancia" value="' + data.mt[0].distancia + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0 m" name="mtDistancia" value="' + data.mt[1].distancia + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0 m" name="mtDistancia" value="' + data.mt[2].distancia + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0 m" name="mtDistancia" value="' + data.mt[3].distancia + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0 m" name="mtDistancia" value="' + data.mt[4].distancia + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Ejemplar</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[0].nomcab + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[1].nomcab + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[2].nomcab + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[3].nomcab + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[4].nomcab + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Jinete</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[0].nomjin + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[1].nomjin + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[2].nomjin + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[3].nomjin + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.mt[4].nomjin + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Tiempo</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d1" name="mtTiempoG" value="' + data.mt[0].tiempog + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d1" name="mtTiempoG" value="' + data.mt[1].tiempog + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d1" name="mtTiempoG" value="' + data.mt[2].tiempog + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d1" name="mtTiempoG" value="' + data.mt[3].tiempog + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d1" name="mtTiempoG" value="' + data.mt[4].tiempog + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Rating</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0" name="mtRating" value="' + data.mt[0].rating + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0" name="mtRating" value="' + data.mt[1].rating + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0" name="mtRating" value="' + data.mt[2].rating + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0" name="mtRating" value="' + data.mt[3].rating + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0" name="mtRating" value="' + data.mt[4].rating + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<div class="vsep10"></div>' +
                        '</div>' +
                        '<div class="vsep10"></div>' +
                        '<div>' +
                            '<fieldset>' +
                                '<legend>Ganador en la distancia con el peor tiempo</legend>' +
                                '<div class="flex">' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Fecha</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="date" class="txb" value="' + data.pt[1].fecha + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="date" class="txb" value="' + data.pt[0].fecha + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Dist.</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0 m" name="ptDistancia" value="' + data.pt[1].distancia + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0 m" name="ptDistancia" value="' + data.pt[0].distancia + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Ejemplar</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.pt[1].nomcab + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.pt[0].nomcab + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Jinete</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.pt[1].nomjin + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb" value="' + data.pt[0].nomjin + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Tiempo</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d1" name="ptTiempoG" value="' + data.pt[1].tiempog + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d1" name="ptTiempoG" value="' + data.pt[0].tiempog + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div class="hsep10"></div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<span class="lbl">Rating</span>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0" name="ptRating" value="' + data.pt[1].rating + '" disabled>' +
                                        '</div>' +
                                        '<div>' +
                                            '<input type="text" class="txb txb-num d0" name="ptRating" value="' + data.pt[0].rating + '" disabled>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</fieldset>' +
                            '<br>' +
                        '</div>' +
                        html +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<br>' +
            '<div class="algoResult"></div>' +
            '<br>';
    }

    // Cuadro de opciones.
    var omitir = (typeof(data.e.omitir) == 'string') ? data.e.omitir : '';
    var ganador = (typeof(data.e.ganador) == 'string') ? data.e.ganador : '';
    var nombreganador = (typeof(data.e.nombreganador) == 'string') ? data.e.nombreganador : '';
    var opcionesHTML =
        '<div class="opciones">' +
            '<fieldset>' +
                '<legend>Opciones</legend>' +
                '<div class="flex">' +
                    '<div>' +
                        '<div>' +
                            '<span class="lbl">Omitir Ejemplares</span>' +
                        '</div>' +
                        '<div class="flex">' +
                            '<input type="text" class="txb txb-str" name="omitir" value="' + omitir + '" maxlength="30" autocomplete="off">' +
                            '<div class="hsep5"></div>' +
                            '<button class="btn btn-info mini-btn btnOmitirSave">' +
                                '<span class="icon icon-floppy-disk"></span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="hsep10"></div>' +
                    '<div class="hsep10"></div>' +
                    '<div>' +
                        '<div>' +
                            '<span class="lbl">Ganador</span>' +
                        '</div>' +
                        '<div class="flex">' +
                            '<input type="text" class="txb" name="ganador" value="' + ganador + '" hidden>' +
                            '<div class="search" functionName="txbGanadorSearchText">' +
                                '<input type="text" class="txb txb-str" name="nombreganador" value="' + nombreganador + '" maxlength="30" autocomplete="off">' +
                            '</div>' +
                            '<div class="hsep5"></div>' +
                            '<button class="btn btn-info mini-btn btnGanadorSave">' +
                                '<span class="icon icon-floppy-disk"></span>' +
                            '</button>' +
                            '<div class="hsep5"></div>' +
                            '<button class="btn btn-info mini-btn btnGenerarResultados">' +
                                '<span class="icon icon-download3"></span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="hsep10"></div>' +
                    '<div class="hsep10"></div>' +
                    '<div>' +
                        '<div>' +
                            '<span class="lbl">Algoritmo&nbsp;</span>' +
                        '</div>' +
                        '<div class="flex">' +
                            '<select name="algo" class="txb"></select>' +
                            '<div class="hsep10"></div>' +
                            '<button class="btn btn-info mini-btn doAlgoAddButton">' +
                                '<span class="icon icon-stats-dots"></span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</fieldset>' +
        '</div>';

    // Agrega el contenido html.
    $('.detailList', currentArea).html(opcionesHTML + html);
    core.linkNativeEvents(currentArea);

    // Si hay un mejor tiempo lo marca.
    if (tiempoId != '') {
        list = $('.itemLine');
        for (var i = 0; i < list.length; i++) {
            var id = $(list[i]).find('.dcompetenciasItemData').find('[name="id"]').val();
            if (tiempoId == id) {
                $(list[i]).find('.itemLineHorseTiempoRating').find('span').addClass('mejorTiempoRating');
                break;
            }
        }
    }

    jornadasAlgoritmosLoad();

    $('.doAlgoAddButton', currentArea).unbind('click');
    $('.doAlgoAddButton', currentArea).click(() => {
        doAlgoAddButtonClick();
    });

    $('.carrerasAddButton', $('.detailList', currentArea)).unbind('hover');
    $('.carrerasAddButton', $('.detailList', currentArea)).hover((o) => {
        var o = $(o.currentTarget).closest('.itemLine').find('.itemLineDetailBox');
        o.css('background-color', '#ddd');
    }, (o) => {
        var o = $(o.currentTarget).closest('.itemLine').find('.itemLineDetailBox');
        o.css('background-color', '#fff');
    });

    $('.btnOmitirSave', $('.detailList', currentArea)).unbind('click');
    $('.btnOmitirSave', $('.detailList', currentArea)).click(() => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');

        // Valida que este seleccionada una competencia.
        if ($('.competenciaItemSelected', $('.competenciasList', currentArea)).length == 0) {
            core.showMessage('Primero debe seleccionar una competencia', 4, core.color.error);
            return;
        }

        var r = core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea)));
        var opciones = core.transform2Json(core.form.getData('.opciones', currentArea));
        var params = {
            idcomp: r.id,
            omitir: opciones.omitir
        };
        
        core.showLoading();
        core.apiFunction('omitirSave', params, (response) => {
            core.hideLoading();
            if (!response.status) {
                core.showMessage(response.message, 4, core.color.error);
                return;
            }
            core.showMessage(response.message, 4, core.color.success);
        });
    });

    $('.btnGanadorSave', $('.detailList', currentArea)).unbind('click');
    $('.btnGanadorSave', $('.detailList', currentArea)).click(() => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');

        // Valida que este seleccionada una competencia.
        if ($('.competenciaItemSelected', $('.competenciasList', currentArea)).length == 0) {
            core.showMessage('Primero debe seleccionar una competencia', 4, core.color.error);
            return;
        }

        var opciones = core.transform2Json(core.form.getData('.opciones', currentArea));
        var params = {
            idcomp: r.id,
            nombreganador: opciones.nombreganador
        };
        
        core.showLoading();
        core.apiFunction('ganadorSave', params, (response) => {
            core.hideLoading();
            if (!response.status) {
                core.showMessage(response.message, 4, core.color.error);
                return;
            }
            core.showMessage(response.message, 4, core.color.success);
        });
    });

    $('.btnGenerarResultados', $('.detailList', currentArea)).unbind('click');
    $('.btnGenerarResultados', $('.detailList', currentArea)).click(() => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        var r = core.transform2Json(core.form.getData($('.detailColumnBox', currentArea)));
        
        var d = {}, di = 0;
        var list = $('.dcompetenciasItemData', currentArea);
        for (var i = 0; i < list.length; i++) {
            d[di] = core.transform2Json(core.form.getData(list[i]));
            di++;
        }

        core.showLoading();
        core.apiFunction('generarResultados', {'r': r, 'd': d}, (response) => {
            core.hideLoading();
            if (!response.status) {
                core.showMessage(response.message, 4, core.color.error);
                return;
            }

            core.showMessage(response.message, 4, core.color.success);
        });
    });

    $('.itemLineNumero', $('.detailList', currentArea)).unbind('click');
    $('.itemLineNumero', $('.detailList', currentArea)).click((o) => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');

        // Guarda el objeto contenedor del detalle de la competencia.
        var obj = $(o.currentTarget);
        core.data.save(currentArea, 'itemSelected', obj);

        core.form.dialog.show('./option-select.php', {}, dcompetenciasOptionHandler);
    });

    $('.itemLineDetailLine', $('.detailList', currentArea)).unbind('click');
    $('.itemLineDetailLine', $('.detailList', currentArea)).click((o) => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');

        // Guarda el objeto contenedor de la linea.
        var obj = $(o.currentTarget);
        core.data.save(currentArea, 'itemSelected', obj);

        // Llama al formulario de seleccion de opcion.
        core.form.dialog.show('./option-select.php', {}, carrerasOptionHandler);
    });

    $('.carrerasAddButton', currentArea).unbind('click');
    $('.carrerasAddButton', currentArea).click((o) => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        var area, data, r;
        area = $(o.currentTarget, currentArea).closest('.itemLine').find('.dcompetenciasItemData');
        data = core.form.getData(area);
        r = {
            id: '',
            numero: data.numero,
            idcab: data.idcab,
            nomcab: data.nomcab
        };
        core.form.dialog.show('./add-carrera.php', r, () => {
            var currentArea = core.tabs.getActiveTabArea('.main-work-area');
            var competencia = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));
            detalleCompetenciasLoad(competencia.id);
        });
    });

    var r;
    if ($('.competenciaItemSelected', $('.competenciasList', currentArea)).length == 0) {
        r = jornadasGetEmptyData();
        r = r.e;
    } else {
        r = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));
    }

    core.form.setData($('.detailColumnBox', currentArea), r);
}

/**
 * Maneja la seleccion del caballo.
 */
function txbGanadorSearchText(e, text) {
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
                var currentArea = core.tabs.getActiveTabArea('.main-work-area');
                var r = core.transform2Json(core.form.getData($(e.currentTarget)));
                
                // Toma el elemento padre.
                var parent = $(e.currentTarget).closest('.search');

                var data = {
                    ganador: r.id,
                    nombreganador: r.nombre
                };
                core.form.setData($('.opciones', currentArea), data);

                // Blanquea y oculta los resultados de la busqueda.
                $(parent).find('.txbSearchBox').html('');
                $(parent).find('.txbSearchBox').css('display', 'none');
            })
        }
    });
}

/**
 * Cuando se hace click en una jornada.
 */
function jornadasSelect(o) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Marca la jornada como activa.
    $('.jornadaItem', $('.jornadasList', currentArea)).removeClass('jornadaItemSelected');
    $(o.currentTarget, currentArea).closest('.jornadaItem').addClass('jornadaItemSelected');

    var r = core.transform2Json(core.form.getData($('.jornadaItemSelected', $('.jornadasList', currentArea))));

    // Carga las competencias de la jornada seleccionada.
    competenciasLoad(r.id);

    // Limpia el area del detalle de las competencias.
    var data = jornadasGetEmptyData()
    jornadasShowCompetencia(data);

    // Carga la informacion de terceros.
    infoTercerosLoad();

    // Inicializa los campos de la cabecera del detalle de la competencia.
    core.form.setData($('.detailColumnBox', currentArea), data.e);
}

/**
 * Agrega el detalle de una competencia.
 */
function detalleAddButtonClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Si no hay ninguna competencia seleccionada.
    if ($('.competenciaItemSelected', $('.competenciasList', currentArea)).length == 0) {
        core.showMessage('Debe seleccionar una competencia', 4, core.color.info);
        return;
    }

    var competencia = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));
    core.form.dialog.show('./add-detalle-competencia.php', {idparent: competencia.id});
}

/**
 * Carga las competencias registradas para una jornada.
 */
function competenciasLoad(idJornada) {
    core.showLoading();
    core.apiFunction('competenciasLoad', {idJornada: idJornada}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var html = '';
        var data = response.data;

        if (Object.keys(data).length == 0) {
            html +=
                '<div>' +
                    '<div class="vsep10"></div>' +
                    '<div class="vsep10"></div>' +
                    '<div class="flex flex-hcenter jornadasNoData">' +
                        '<span>Sin Competencias</span>' +
                    '</div>' +
                '</div>';
        } else {
            for (var i = 0; i < Object.keys(data).length; i++) {
                html +=
                    '<div class="vsep10"></div>' +
                    '<div class="competenciasItem">' +
                        '<input class="txb" name="id" value="' + data[i].id + '" hidden>' +
                        '<input class="txb" name="idparent" value="' + data[i].idparent + '" hidden>' +
                        '<input class="txb" name="carrera" value="' + data[i].carrera + '" hidden>' +
                        '<input class="txb" name="descrip" value="' + data[i].descrip + '" hidden>' +
                        '<input class="txb" name="fecha" value="' + data[i].fecha + '" hidden>' +
                        '<input class="txb" name="codigo" value="' + data[i].codigo + '" hidden>' +
                        '<input class="txb" name="distancia" value="' + data[i].distancia + '" hidden>' +
                        '<div class="competenciaTitleBox">' +
                            '<div class="flex flex-space-between">' +
                                '<div>' +
                                    '<span>Carrera ' + data[i].carrera + '</span>' +
                                '</div>' +
                                '<div class="flex">' +
                                    '<button class="btn btn-light mini-btn competenciasEditButton">' +
                                        '<span class="icon icon-pencil"></span>' +
                                    '</button>' +
                                    '<div class="hsep5"></div>' +
                                    '<button class="btn btn-danger mini-btn competenciasDeleteButton">' +
                                        '<span class="icon icon-bin"></span>' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="competenciaItemDescripBox">' +
                            '<span>' + data[i].descrip + '</span>' +
                        '</div>' +
                        '<div class="flex flex-space-between">' +
                            '<div class="competenciaItemDescripBox">' +
                                '<span>' + data[i].codigo + '</span>' +
                            '</div>' +
                            '<div class="competenciaItemDescripBox">' +
                                '<span>' + data[i].distancia + 'mts</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }
            html += '<br>';
        }

        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        $('.competenciasList', currentArea).html(html);

        $('.competenciasEditButton', currentArea).unbind('click');
        $('.competenciasEditButton', currentArea).click((o) => {
            competenciasEditButtonClick(o);
        });

        $('.competenciasDeleteButton', currentArea).unbind('click');
        $('.competenciasDeleteButton', currentArea).click((o) => {
            competenciasDeleteButtonClick(o);
        });

        $('.competenciasItem', currentArea).unbind('click');
        $('.competenciasItem', currentArea).click((o) => {
            competenciasSelect(o);
        });

        jornadasShowCompetencia(jornadasGetEmptyData());
    });
}

/**
 * Carga las jornadas registradas en el sistema.
 */
function jornadasLoad() {
    core.showLoading();
    core.apiFunction('jornadasLoad', {}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var html = '';
        var data = response.data;
        if (Object.keys(data).length == 0) {
            html +=
                '<div>' +
                    '<div class="vsep10"></div>' +
                    '<div class="vsep10"></div>' +
                    '<div class="flex flex-hcenter jornadasNoData">' +
                        '<span>Sin Jornadas</span>' +
                    '</div>' +
                '</div>';
        } else {
            for (var i = 0; i < Object.keys(data).length; i++) {
                html +=
                    '<div class="vsep10"></div>' +
                    '<div class="jornadaItem">' +
                        '<input class="txb" name="id" value="' + data[i].id + '" hidden>' +
                        '<input class="txb" name="fecha" value="' + data[i].fecha + '" hidden>' +
                        '<input class="txb" name="descrip" value="' + data[i].descrip + '" hidden>' +
                        '<div class="flex flex-space-between">' +
                            '<div class="jornadaItemFechaBox">' +
                                '<span>' + core.format.formatDate(data[i].fecha) + '</span>' +
                            '</div>' +
                            '<div class="jornadaItemButtonsBox flex">' +
                                '<button class="btn btn-light mini-btn jornadaItemEditButton">' +
                                    '<span class="icon icon-pencil"></span>' +
                                '</button>' +
                                '<div class="hsep5"></div>' +
                                '<button class="btn btn-danger mini-btn jornadaItemDeleteButton">' +
                                    '<span class="icon icon-bin"></span>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="vsep5"></div>' +
                        '<div class="jornadaItemDescripBox hideText">' +
                            '<span>' + data[i].descrip + '</span>' +
                        '</div>' +
                    '</div>';
            }
    
            html += '<br>';
        }

        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        $('.jornadasList', currentArea).html(html);

        $('.jornadaItemEditButton', currentArea).unbind('click');
        $('.jornadaItemEditButton', currentArea).click((o) => {
            jornadaItemEditButtonClick(o);
        });

        $('.jornadaItemDeleteButton', currentArea).unbind('click');
        $('.jornadaItemDeleteButton', currentArea).click((o) => {
            jornadaItemDeleteButtonClick(o);
        });

        $('.jornadaItem', currentArea).unbind('click');
        $('.jornadaItem', currentArea).click((o) => {
            jornadasSelect(o);
        });
    });
}

/**
 * Funcion para manejar la respues de las opciones del detalle de la competencia.
 */
function dcompetenciasOptionHandler() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Toma la opcion seleccionada.
    var option = core.form.dialog.getBackwardData();

    // Toma el registro previamente seleccionado.
    var obj = core.data.restore(currentArea, 'itemSelected');

    var r = core.transform2Json(core.form.getData($(obj).siblings('.dcompetenciasItemData')));

    switch (option) {
        case 'E':
            core.form.dialog.show('./add-detalle-competencia.php', r);
            break;
        case 'D':
            core.showConfirm({
                'icon': 'icon icon-bin',
                'title': 'Confirmar Eliminar Item de Competencia',
                'message': 'Se dispone a eliminar este item de la competencia, esta acción no se puede revertir, ¿Esta seguro?',
                'callbackOk': () => {
                    core.showLoading();
                    core.apiFunction('detalleCompetenciaDelete', {id: r.id}, (response) => {
                        core.hideLoading();
                        if (!response.status) {
                            core.showMessage(response.message, 4, core.color.error);
                            return;
                        }
                        core.showMessage(response.message, 4, core.color.success);
                        detalleCompetenciasLoad(r.idparent);
                    });
                }
            });            
            break;
    }
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
    r = core.transform2Json(core.form.getData($(obj).closest('.itemLine').find('.dcompetenciasItemData')));

    // Toma los datos del item seleccionado.
    d = core.transform2Json(core.form.getData(obj));

    // Agrega numero y el nombre del caballo.
    d.numero = r.numero;
    d.nomcab = r.nomcab;

    switch (option) {
        case 'E':
            core.form.dialog.show('./add-carrera.php', d, () => {
                var currentArea = core.tabs.getActiveTabArea('.main-work-area');
                var competencia = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));
                detalleCompetenciasLoad(competencia.id);
            });
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
                        var competencia = core.transform2Json(core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea))));
                        detalleCompetenciasLoad(competencia.id);
                    });
                }
            });            
            break;
    }
}

/**
 * Carga la lista de algoritmos registrados.
 */
function jornadasAlgoritmosLoad() {
    core.showLoading();
    core.apiFunction('algoSearch', {'textToFind': ''}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        var html = '<option value="">Seleccione</option>';
        var d = response.data;
        for (var i = 0; i < Object.keys(d).length; i++) {
            html += '<option value="' + d[i].id + '">' + d[i].nombre + '</option>'
        }

        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        $('[name="algo"]', currentArea).html(html);

        // Enlaza el evento change al combo.
        $('[name="algo"]', currentArea).unbind('change');
        $('[name="algo"]', currentArea).change(() => {
            var currentArea = core.tabs.getActiveTabArea('.main-work-area');
            var lastAlgo = $('[name="algo"]', currentArea).val();
            core.data.save(currentArea, 'lastAlgo', lastAlgo);
        });

        // Carga y establece el ultimo algoritmo seleccionado.
        var lastAlgo = core.data.restore(currentArea, 'lastAlgo');

        if (typeof(lastAlgo) == 'undefined') {
            lastAlgo = '';
        }

        $('[name="algo"]', currentArea).val(lastAlgo);
    });
}

/**
 * Ejecuta el algoritmo seleccionado.
 */
function doAlgoAddButtonClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Toma la competencia seleccionada.
    var jqObject = $('.competenciaItemSelected', $('.competenciasList', currentArea));

    if (jqObject.length == 0) {
        core.showMessage('No hay una competencia seleccionada', 4, core.color.info);
        return;
    }

    competencia = core.transform2Json(core.form.getData(jqObject));

    // Toma el nombre del algoritmo.
    var r = core.transform2Json(core.form.getData('.opciones', currentArea));
    var params = {
        idalgo: r.algo,
        idcomp: competencia.id
    };

    core.showLoading();
    core.apiFunction('algoExec', params, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        core.showMessage(response.message, 4, core.color.success);
        var d = response.data, html = '';

        for (var i = 0; i < Object.keys(d).length; i++) {
            html +=
                '<div class="flex">' +
                    '<div class="numcabBox">' +
                        '<span class="lbl">' + d[i].numero + ')<span>' +
                    '</div>' +
                    '<div class="nomcabBox">' +
                        '<span class="lbl">' + d[i].nomcab + '<span>' +
                    '</div>' +
                    '<div class="valorBox">' +
                        '<span class="lbl">' + core.format.numberFormat(d[i].valor, 2, false) + '<span>' +
                    '</div>' +
                '</div>';
        }
        
        // Mete la informacion en una ventana.
        html =
            '<div class="flex flex-hcenter">' +
                '<div class="window">' +
                    '<div class="windowTitle">' +
                        '<h6>Resultados del Algoritmo</h6>' +
                    '</div>' +
                    '<div class="windowBox">' +
                        '<div>' +
                            html +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        
        // Agrega la ventana para el grafico.
        html +=
            '<br>' +
            '<div class="graficaResultadosBox">' +
                '<div class="window">' +
                    '<div class="windowTitle">' +
                        '<h6>Gráfica de Resultados</h6>' +
                    '</div>' +
                    '<div class="windowBox">' +
                        '<div class="graficaBox">' +
                            '<canvas class="grafica"></canvas>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        
        // Agrega el codigo html al DOM.
        $('.algoResult', currentArea).html(html);

        // Genera el grafico.
        buildGraphics(d);
    });
}

/**
 * Genera el grafico.
 */
function buildGraphics(data) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Obtener una referencia al elemento canvas del DOM
    const grafica = $('.grafica', currentArea);

    // Las etiquetas son las que van en el eje X. 
    var etiquetas = [], valores = [];
    for (var i = 0; i < Object.keys(data).length; i++) {
        etiquetas[i] = data[i].nomcab;
        valores[i] = core.format.numberFormat(data[i].valor, 2, false);
    }

    // Podemos tener varios conjuntos de datos. Comencemos con uno
    const datosEjemplares = {
        label: "Ejemplares Participantes",
        data: valores,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
    };

    new Chart(grafica, {
        type: 'bar',// Tipo de gráfica
        data: {
            labels: etiquetas,
            datasets: [
                datosEjemplares // ,
                // Aquí más datos...
            ]
        }
    });
}


/**
 * Agrega informacion de terceros.
 */
function btnAddInfoTercerosClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    
    if ($('.jornadaItemSelected', $('.jornadasList', currentArea)).length == 0) {
        core.showMessage('Debe seleccionar una jornada', 4, core.color.info);
        return;
    }

    var jornada = core.transform2Json(core.form.getData($('.jornadaItemSelected', $('.jornadasList', currentArea))));

    var r = {idjor: jornada.id};
    core.form.dialog.show('./add-info-terceros.php', r);
}


/**
 * Edita un item de la informacion de terceros.
 */
function btnInfoTercerosItemEditClick(t) {
    var cnt = $(t.currentTarget).closest('.infoTercerosItem');
    var r = core.transform2Json(core.form.getData(cnt));

    core.form.dialog.show('./add-info-terceros.php', r);
}


/**
 * Elimina un item de la informacion de terceros.
 */
function btnInfoTercerosItemDeleteClick(t) {
    core.showConfirm({
        'icon': 'icon icon-bin',
        'title': 'Confirmar Eliminar',
        'message': 'Se dispone a eliminar el registro, ¿está seguro?',
        'callbackOk': () => {
            var cnt = $(t.currentTarget).closest('.infoTercerosItem');
            var r = core.transform2Json(core.form.getData(cnt));

            core.showLoading();
            core.apiFunction('addInfoTercerosDelete', {'id': r.id}, (response) => {
                core.hideLoading();
                if (!response.status) {
                    core.showMessage(response.message, 4, core.color.error);
                    return;
                }

                core.showMessage(response.message, 4, core.color.success);
                infoTercerosLoad();
            });
        }
    });
}


/**
 * Muestra la informacion de terceros en el retrospecto.
 */
function btnInfoTercerosItemViewClick(t) {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    // Valida que este seleccionada una competencia.
    if ($('.competenciaItemSelected', $('.competenciasList', currentArea)).length == 0) {
        core.showMessage('Primero debe seleccionar una competencia', 4, core.color.error);
        return;
    }

    var r = core.form.getData($('.competenciaItemSelected', $('.competenciasList', currentArea)));    

    // Toma el numero de la carrera.
    var carrera = r.carrera;

    // Toma la informacion de terceros.
    var cnt = $(t.currentTarget).closest('.infoTercerosItem');
    var info = core.transform2Json(core.form.getData(cnt));
    var numeros = [];

    // Si tiene asociada una carrera.
    switch (carrera) {
        case info.c1id:
            numeros = core.removeChars(info.c1, '()').split('-');
            break;
        case info.c2id:
            numeros = core.removeChars(info.c2, '()').split('-');
            break;
        case info.c3id:
            numeros = core.removeChars(info.c3, '()').split('-');
            break;
        case info.c4id:
            numeros = core.removeChars(info.c4, '()').split('-');
            break;
        case info.c5id:
            numeros = core.removeChars(info.c5, '()').split('-');
            break;
        case info.c6id:
            numeros = core.removeChars(info.c6, '()').split('-');
            break;
    }

    // Desmarca cualquier ejemplar de la lista que se encuentre marcado.
    btnInfoTercerosItemHideClick();

    // Si no hay ejemplares o carrera asignada.
    if (numeros.length == 0 || (numeros.length == 1 && numeros[0] == '')) {
        return;
    }

    // Recorre los ejemplares participantes de la carrera.
    var listaEjemplares = $('.itemLine', currentArea);
    var data, ln;

    for (var i = 0; i < listaEjemplares.length; i++) {
        data = core.form.getData($('.dcompetenciasItemData', listaEjemplares[i]));

        // Si el numero esta en la lista.
        for (var k = 0; k < numeros.length; k++) {
            if (numeros[k] == data.numero) {
                ln = $('.itemLineNumero', currentArea)[i];
                $(ln).addClass('txbInfoTercerosMarca');
                ln = $('.grupoDetalleCompetencia', currentArea)[i];
                $(ln).addClass('txbInfoTercerosMarca');
                break;
            }
        }
    }
}


/**
 * Desmarca la informacion de terceros.
 */
function btnInfoTercerosItemHideClick() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    $('.itemLineNumero', currentArea).removeClass('txbInfoTercerosMarca');
    $('.grupoDetalleCompetencia', currentArea).removeClass('txbInfoTercerosMarca');
}


/**
 * Carga la informacion de terceros.
 */
function infoTercerosLoad() {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    
    if ($('.jornadaItemSelected', $('.jornadasList', currentArea)).length == 0) {
        $('.infoTercerosBox', currentArea).html('');
        return;
    }

    var jornada = core.transform2Json(core.form.getData($('.jornadaItemSelected', $('.jornadasList', currentArea))));

    var r = {idjor: jornada.id};

    core.showLoading();
    core.apiFunction('addInfoTercerosLoad', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var html = '';
        var data = response.data;

        for (var i = 0; i < Object.keys(data).length; i++) {
            html +=
                '<div class="infoTercerosItem">' +
                    '<fieldset>' +
                        '<legend class="hideText">' + data[i].nombre + '</legend>' +
                        '<input type="text" class="txb" name="id" value="' + data[i].id + '" hidden>' +
                        '<input type="text" class="txb" name="idjor" value="' + data[i].idjor + '" hidden>' +
                        '<input type="text" class="txb" name="nombre" value="' + data[i].nombre + '" hidden>' +
                        '<input type="text" class="txb" name="c1id" value="' + data[i].c1id + '" hidden>' +
                        '<input type="text" class="txb" name="c2id" value="' + data[i].c2id + '" hidden>' +
                        '<input type="text" class="txb" name="c3id" value="' + data[i].c3id + '" hidden>' +
                        '<input type="text" class="txb" name="c4id" value="' + data[i].c4id + '" hidden>' +
                        '<input type="text" class="txb" name="c5id" value="' + data[i].c5id + '" hidden>' +
                        '<input type="text" class="txb" name="c6id" value="' + data[i].c6id + '" hidden>' +
                        '<div class="flex">' +
                            '<div>' +
                                '<div class="flex">' +
                                    '<span class="lbl">1)</span>' +
                                    '<div class="hsep5"></div>' +
                                    '<input type="text" class="txb txbInfoTerceros" name="c1" value="' + data[i].c1 + '" disabled>' +
                                '</div>' +
                                '<div class="flex">' +
                                    '<span class="lbl">2)</span>' +
                                    '<div class="hsep5"></div>' +
                                    '<input type="text" class="txb txbInfoTerceros" name="c2" value="' + data[i].c2 + '" disabled>' +
                                '</div>' +
                                '<div class="flex">' +
                                    '<span class="lbl">3)</span>' +
                                    '<div class="hsep5"></div>' +
                                    '<input type="text" class="txb txbInfoTerceros" name="c3" value="' + data[i].c3 + '" disabled>' +
                                '</div>' +
                                '<div class="flex">' +
                                    '<span class="lbl">4)</span>' +
                                    '<div class="hsep5"></div>' +
                                    '<input type="text" class="txb txbInfoTerceros" name="c4" value="' + data[i].c4 + '" disabled>' +
                                '</div>' +
                                '<div class="flex">' +
                                    '<span class="lbl">5)</span>' +
                                    '<div class="hsep5"></div>' +
                                    '<input type="text" class="txb txbInfoTerceros" name="c5" value="' + data[i].c5 + '" disabled>' +
                                '</div>' +
                                '<div class="flex">' +
                                    '<span class="lbl">6)</span>' +
                                    '<div class="hsep5"></div>' +
                                    '<input type="text" class="txb txbInfoTerceros" name="c6" value="' + data[i].c6 + '" disabled>' +
                                '</div>' +
                            '</div>' +
                            '<div class="hsep10"></div>' +
                            '<div>' +
                                '<button class="btn btn-primary mini-btn btnInfoTercerosItemEdit">' +
                                    '<span class="icon icon-pencil"></span>' +
                                '</button>' +
                                '<div class="vsep5"></div>' +
                                '<button class="btn btn-danger mini-btn btnInfoTercerosItemDelete">' +
                                    '<span class="icon icon-bin"></span>' +
                                '</button>' +
                                '<div class="vsep5"></div>' +
                                '<button class="btn btn-dark mini-btn btnInfoTercerosItemView">' +
                                    '<span class="icon icon-eye"></span>' +
                                '</button>' +
                                '<div class="vsep5"></div>' +
                                '<button class="btn btn-dark mini-btn btnInfoTercerosItemHide">' +
                                    '<span class="icon icon-eye-blocked"></span>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</fieldset>' +
                '</div>';
        }

        $('.infoTercerosBox', currentArea).html(html);

        // Enlaza los eventos.
        $('.btnInfoTercerosItemEdit', currentArea).unbind('click');
        $('.btnInfoTercerosItemEdit', currentArea).click((t) => {
            btnInfoTercerosItemEditClick(t);
        });

        $('.btnInfoTercerosItemDelete', currentArea).unbind('click');
        $('.btnInfoTercerosItemDelete', currentArea).click((t) => {
            btnInfoTercerosItemDeleteClick(t);
        });

        $('.btnInfoTercerosItemView', currentArea).unbind('click');
        $('.btnInfoTercerosItemView', currentArea).click((t) => {
            btnInfoTercerosItemViewClick(t);
        });

        $('.btnInfoTercerosItemHide', currentArea).unbind('click');
        $('.btnInfoTercerosItemHide', currentArea).click(() => {
            btnInfoTercerosItemHideClick();
        });
    });
}


/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');
    core.linkNativeEvents(currentArea);

    // $('.informacion', currentArea).slideToggle();
    core.data.save($('.informacion', currentArea), 'toggleState', 0);

    $('.jornadasAddButton', currentArea).unbind('click');
    $('.jornadasAddButton', currentArea).click(() => {
        jornadasAddButtonClick();
    });

    $('.competenciasAddButton', currentArea).unbind('click');
    $('.competenciasAddButton', currentArea).click(() => {
        competenciasAddButtonClick();
    });

    $('.detalleAddButton', currentArea).unbind('click');
    $('.detalleAddButton', currentArea).click(() => {
        detalleAddButtonClick();
    });

    $('.btnAddInfoTerceros', currentArea).unbind('click');
    $('.btnAddInfoTerceros', currentArea).click(() => {
        btnAddInfoTercerosClick();
    });

    $('.infoTercerosButton').unbind('click');
    $('.infoTercerosButton').click(() => {
        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        var toggleState = core.data.restore($('.informacion', currentArea), 'toggleState');

        $($('.informacion', currentArea)).slideToggle();

        if (toggleState == 0) {
            $('.detailList', currentArea).css('height', 'calc(100vh - 490px)');
            toggleState = 1;
        } else {
            $('.detailList', currentArea).css('height', 'calc(100vh - 200px)');
            toggleState = 0;
        }
        core.data.save($('.informacion', currentArea), 'toggleState', toggleState);
    });

    jornadasLoad();
});
