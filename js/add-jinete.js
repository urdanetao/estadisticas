
/**
 * Agrega un caballo.
 */
function addJineteSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    core.showLoading();
    core.apiFunction('jinetesSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        core.showMessage(response.message, 4, core.color.success);

        var data = core.transform2Json(core.form.getData(cnt));
        data.idjin = response.data.id;
        data.nomjin = r.nombre;
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

    $('.addJineteSaveButton', cnt).unbind('click');
    $('.addJineteSaveButton', cnt).click(() => {
        addJineteSaveButtonClick();
    });

    $('.addJineteCancelButton', cnt).unbind('click');
    $('.addJineteCancelButton', cnt).click(() => {
        core.form.dialog.close();
    });
});
