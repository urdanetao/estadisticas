
function foo(e, text) {
    if (text.length < 2) {
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
                
                var element = $(e.currentTarget).closest('.txbSearchBox');
                element.html('');
                element.css('display', 'none');
                core.form.setData('.testBody', r);
            })
        }
    });
}

$(() => {
});
