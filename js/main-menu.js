
/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.main-work-area');

    $('.optCaballos', currentArea).unbind('click');
    $('.optCaballos', currentArea).click(() => {
        core.tabs.build('.main-work-area', 'Caballos', './caballos.php', true);
    });

    $('.optJinetes', currentArea).unbind('click');
    $('.optJinetes', currentArea).click(() => {
        core.tabs.build('.main-work-area', 'Jinetes', './jinetes.php', true);
    });

    $('.optPreparadores', currentArea).unbind('click');
    $('.optPreparadores', currentArea).click(() => {
        core.tabs.build('.main-work-area', 'Preparadores', './preparadores.php', true);
    });

    $('.optAlgo', currentArea).unbind('click');
    $('.optAlgo', currentArea).click(() => {
        core.tabs.build('.main-work-area', 'Algoritmos', './algo.php', true);
    });

    $('.optHistorico', currentArea).unbind('click');
    $('.optHistorico', currentArea).click(() => {
        core.tabs.build('.main-work-area', 'Historico', './historico.php', true);
    });

    $('.optJornadas', currentArea).unbind('click');
    $('.optJornadas', currentArea).click(() => {
        core.tabs.build('.main-work-area', 'Jornadas', './jornadas.php', true);
    });
});
