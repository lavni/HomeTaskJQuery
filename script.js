$(document).ready( function() {

//variables

    var $flagButton = true;
    var $inp = $('input');
    var $info = [0, 0, 0]; //incomplete, complete, deleted

//listeners

    $('.btn-primary').on('click', function() {
        $('form').fadeToggle('300');
        toggleTextButton();
    });
    $('.btn-success').on('click', function() {
        var $value = $inp.val();
        var $id = getId();
        $('.list').append('<div class="row" data-id=' + $id + '>' +
            '<div class="col-xs-3">'+ $value + '</div>' +
            '<div class="status bg-warning col-xs-3">Unfinished</div>' +
            '<div class="col-xs-3 act done"><a>Finish</a></div>' +
            '<div class="col-xs-3 act delete"><a>Delete</a></div>' +
            '</div>');
        $inp.val('');
        increaseIncompleted();
        updateInfo();
        updateLocalStorage($value, $id, 'add');
        setTimeout(function () {
            $('form').hide('fast');
        }, 300);
        toggleTextButton();

    });

    $('.list').on('mouseover', '.row', function() {
        $(this).find('.act').show();
    });

    $('.list').on('mouseout', '.row', function() {
        $(this).find('.act').hide();
    });

    $('.list').on('click', '.done a', function() {
        var $id = $(this).parents('.row').data('id')
        if ($(this).parents('.row').find('.status').hasClass('bg-warning')) {
            $(this).text('Start again');
            $(this).parents('.row').find('.status').text('Finished').removeClass('bg-warning').addClass('bg-success');
            decreaseIncompleted();
            increaseCompleted();
            updateInfo();
            updateLocalStorage(null, $id, 'edit')
        } else {
            $(this).text('Finish');
            $(this).parents('.row').find('.status').text('Unfinished').removeClass('bg-success').addClass('bg-warning');
            increaseIncompleted();
            decreaseCompleted();
            updateInfo();
            updateLocalStorage(null, $id, 'edit')
        }
    });

    $('.list').on('click', '.delete a', function() {
        var $id = $(this).parents('.row').data('id')
        $(this).parents('.row').fadeOut('slow');
        if ($(this).parents('.row').find('.status').hasClass('bg-warning')) {
            decreaseIncompleted();
        } else {
            decreaseCompleted();
        }
        increaseDeleted();
        updateInfo();
        updateLocalStorage(null, $id, 'delete');
    });

    localStorage.clear();
    updateInfo();

//functions

    function updateInfo() {
        for (var i = 0; i< $info.length; i++) {
            $('.info').find('#'+i).text($info[i]);
        }
    };
    function toggleTextButton () {
        if ($flagButton) {
            $('.btn-primary').text('Close form');
            $flagButton = false;
        } else {
            $('.btn-primary').text('Create new task');
            $flagButton = true;
        }
    }
    function increaseIncompleted() {
        $info[0]++;
    }
    function decreaseIncompleted() {
        $info[0]--;
    }
    function increaseCompleted() {
        $info[1]++;
    }
    function decreaseCompleted() {
        $info[1]--;
    }
    function increaseDeleted() {
        $info[2]++;
    }

    function getId() {
        return Math.floor((Math.random() * 100000) + 1);
    }

    function addToLocalStorage(list) {
        localStorage.setItem('LIST', JSON.stringify(list));
    }
    function getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('LIST'));
    }

    function updateLocalStorage(val, id, act) {
        var data = getFromLocalStorage();
        switch (act) {
            case 'add':
                var item = {text: val, id: id, status: 'new'};
                if (localStorage.length !== 0) {
                    data.push(item);
                    addToLocalStorage(data);
                } else {
                    addToLocalStorage([item]);
                }
                break;
            case 'edit':
                data.map(function (item) {
                    if (item.id === id) {
                        item.status = item.status === 'new' ? 'done' : 'new';
                    };
                });
                addToLocalStorage(data);
                break;
            case 'delete':
                var index = data.findIndex(function(item) {return item.id === id});
                data.splice(index, 1)
                addToLocalStorage(data);
                break;
            default:
                return true;
        }
    }
});
