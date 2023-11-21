
/**
 * Guarda la jornada.
 */
function addJornadasSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    core.showLoading();
    core.apiFunction('jornadasSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        jornadasLoad();
        core.showMessage(response.message, 4, core.color.success);
        core.form.dialog.close();
    });
}

/**
 * On Load.
 */
$(() => {
    var cnt = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(cnt);

    $('.addJornadasSaveButton', cnt).unbind('click');
    $('.addJornadasSaveButton', cnt).click(() => {
        addJornadasSaveButtonClick()
    });

    $('.addJornadasCancelButton', cnt).unbind('click');
    $('.addJornadasCancelButton', cnt).click(() => {
        core.form.dialog.close();
    });

    var params = core.data.restore(cnt, 'params');
    core.form.setData(cnt, params);
});
