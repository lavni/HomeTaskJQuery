$(document).ready( function() {
    var $flagButton = true;
    var $inp = $('input');
    var $info = [0, 0, 0];
    function updateInfo() {
        for (var i = 0; i< $info.length; i++) {
            $('.info').find('#'+i).text($info[i]);
        }
    };
    $('.btn-primary').on('click', function() {
        $('form').fadeToggle('300');
        toggleTextButton();
    });
    $('.btn-success').on('click', function() {
        var $value = $inp.val();
        $('.list').append('<div class="row">' +
            '<div class="col-xs-3">'+ $value + '</div>' +
            '<div class="status bg-warning col-xs-3">Незаконченное</div>' +
            '<div class="col-xs-3 act done"><a>Завершить</a></div>' +
            '<div class="col-xs-3 act delete"><a>Удалить</a></div>' +
            '</div>');
        $inp.val('');
        $info[0]++;
        updateInfo();
        setTimeout(function () {
            $('form').hide('fast');
        }, 300);
        toggleTextButton();
    });

    function toggleTextButton () {
        if ($flagButton) {
            $('.btn-primary').text('Закрыть форму');
            $flagButton = false;
        } else {
            $('.btn-primary').text('Добавить дело');
            $flagButton = true;
        }
    }
    $('.list').on('mouseover', '.row', function() {
        $(this).find('.act').show();
    });
    $('.list').on('mouseout', '.row', function() {
        $(this).find('.act').hide();
    });

    $('.list').on('click', '.done a', function() {
        if ($(this).parents('.row').find('.status').hasClass('bg-warning')) {
            $(this).text('Снова начать');
            $(this).parents('.row').find('.status').text('Завершено').removeClass('bg-warning').addClass('bg-success');
            $info[0]--;
            $info[1]++;
            updateInfo();
        } else {
            $(this).text('Завершить');
            $(this).parents('.row').find('.status').text('Незаконченное').removeClass('bg-success').addClass('bg-warning');
            $info[0]++;
            $info[1]--;
            updateInfo();
        }
    });

    $('.list').on('click', '.delete a', function() {
        $(this).parents('.row').fadeOut('slow');
        if ($(this).parents('.row').find('.status').hasClass('bg-warning')) {
            $info[0]--;
        } else {
            $info[1]--;
        }
        $info[2]++;
        updateInfo();
    });

    updateInfo();
});
