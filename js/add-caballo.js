
/**
 * Agrega un caballo.
 */
function addCaballoSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    core.showLoading();
    core.apiFunction('caballosSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        core.showMessage(response.message, 4, core.color.success);

        var data = core.transform2Json(core.form.getData(cnt));
        data.idcab = response.data.id;
        data.nomcab = r.nombre;
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

    $('.addCaballoSaveButton', cnt).unbind('click');
    $('.addCaballoSaveButton', cnt).click(() => {
        addCaballoSaveButtonClick();
    });

    $('.addCaballoCancelButton', cnt).unbind('click');
    $('.addCaballoCancelButton', cnt).click(() => {
        core.form.dialog.close();
    });
});
