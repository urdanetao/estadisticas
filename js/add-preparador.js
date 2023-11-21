
/**
 * Agrega un caballo.
 */
function addPreparadorSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    core.showLoading();
    core.apiFunction('preparadoresSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        core.showMessage(response.message, 4, core.color.success);

        var data = core.transform2Json(core.form.getData(cnt));
        data.idprep = response.data.id;
        data.nomprep = r.nombre;
        core.form.setData(cnt, data);
        core.form.dialogGeneric2.close();
    });
}

/**
 * On Load.
 */
$(() => {
    var cnt = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(cnt);

    $('.addPreparadorSaveButton', cnt).unbind('click');
    $('.addPreparadorSaveButton', cnt).click(() => {
        addPreparadorSaveButtonClick();
    });

    $('.addPreparadorCancelButton', cnt).unbind('click');
    $('.addPreparadorCancelButton', cnt).click(() => {
        core.form.dialog.close();
    });
});
