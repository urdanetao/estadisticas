
/**
 * Guarda la informacion de terceros.
 */
function btnAddInfoTercerosSaveButtonClick() {
    var cnt = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(cnt));

    core.showLoading();
    core.apiFunction('addInfoTercerosSave', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        core.showMessage(response.message, 4, core.color.success);

        // Carga la informacion de terceros.
        infoTercerosLoad();

        core.form.dialog.close();
    });
}

/**
 * On load.
 */
$(()=> {
    var cnt = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(cnt);

    $('.btnAddInfoTercerosSaveButton').unbind('click');
    $('.btnAddInfoTercerosSaveButton').click(() => {
        btnAddInfoTercerosSaveButtonClick();
    });

    $('.btnAddInfoTercerosCloseButton').unbind('click');
    $('.btnAddInfoTercerosCloseButton').click(() => {
        core.form.dialog.close();
    });

    var params = core.data.restore(cnt, 'params');
    core.form.setData(cnt, params);
});
