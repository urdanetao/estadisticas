
/**
 * Guarda la jornada.
 */
function addCompetenciasSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    core.showLoading();
    core.apiFunction('competenciasSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var currentArea = core.tabs.getActiveTabArea('.main-work-area');
        var jornada = core.transform2Json(core.form.getData($('.jornadaItemSelected', $('.jornadasList', currentArea))));
        competenciasLoad(jornada.id);

        core.showMessage(response.message, 4, core.color.success);
        core.form.dialog.close();
    });
}

/**
 * Cuando seleccionan una carrera.
 */
function addCompetenciasCarreraChange() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));
    var descrip = '';

    switch (r.carrera) {
        case '1':
            descrip = 'PRIMERA CARRERA';
            break;
        case '2':
            descrip = 'SEGUNDA CARRERA';
            break;
        case '3':
            descrip = 'TERCERA CARRERA';
            break;
        case '4':
            descrip = 'CUARTA CARRERA';
            break;
        case '5':
            descrip = 'QUINTA CARRERA';
            break;
        case '6':
            descrip = 'SEXTA CARRERA';
            break;
        case '7':
            descrip = 'SEPTIMA CARRERA';
            break;
        case '8':
            descrip = 'OCTAVA CARRERA';
            break;
        case '9':
            descrip = 'NOVENA CARRERA';
            break;
        case '10':
            descrip = 'DECIMA CARRERA';
            break;
        case '11':
            descrip = 'UNDECIMA CARRERA';
            break;
        case '12':
            descrip = 'DUODECIMA CARRERA';
            break;
        case '13':
            descrip = 'DECIMO TERCERA CARRERA';
            break;
        case '14':
            descrip = 'DECIMO CUARTA CARRERA';
            break;
        case '15':
            descrip = 'DECIMO QUITA CARRERA';
            break;
    }

    r.descrip = descrip;
    core.form.setData('.addCompetenciasBody', r);
}

/**
 * On Load.
 */
$(() => {
    var cnt = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(cnt);

    $('[name="carrera"]', '.addCompetenciasBody').unbind('change');
    $('[name="carrera"]', '.addCompetenciasBody').change(() => {
        addCompetenciasCarreraChange();
    });

    $('.addCompetenciasSaveButton', cnt).unbind('click');
    $('.addCompetenciasSaveButton', cnt).click(() => {
        addCompetenciasSaveButtonClick()
    });

    $('.addCompetenciasCancelButton', cnt).unbind('click');
    $('.addCompetenciasCancelButton', cnt).click(() => {
        core.form.dialog.close();
    });

    addCompetenciasCarreraChange();

    var params = core.data.restore(cnt, 'params');
    core.form.setData(cnt, params);
});
