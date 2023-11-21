
/**
 * On Load.
 */
$(() => {
    var cnt = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(cnt);

    // Editar.
    $('.optionSelectEditButton', cnt).unbind('click');
    $('.optionSelectEditButton', cnt).click(() => {
        core.form.dialog.setBackwardData('E');
        core.form.dialog.close();
    });

    // Eliminar.
    $('.optionSelectDeleteButton', cnt).unbind('click');
    $('.optionSelectDeleteButton', cnt).click(() => {
        core.form.dialog.setBackwardData('D');
        core.form.dialog.close();
    });

    // Cerrar.
    $('.optionSelectCloseButton', cnt).unbind('click');
    $('.optionSelectCloseButton', cnt).click(() => {
        core.form.dialog.setBackwardData('C');
        core.form.dialog.close();
    });

    core.form.dialog.setBackwardData('C');
});
