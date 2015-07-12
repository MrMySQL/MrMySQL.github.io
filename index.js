$(function() {
    $( "#dialog-message" ).dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });
});

function showLoader(div){
    var img = $(document.createElement('img')).attr({
        id: 'smallloader',
        src: 'images/ajax_loader_green_128.gif',
        width: 128,
        height: 128
    });
    img.css('position', 'relative');
    img.css('top', div.height()/2 - 64);
    img.css('left', div.width()/2 - 64);

    div.append(img);
}

function hideLoader(){
    $('#smallloader').remove();
}

function getStreams(div, game) {
    div.html('');
    showLoader(div);
    game = game.replace(' ', '+');
    $.ajax({
        url: 'https://api.twitch.tv/kraken/streams?game='+game+'&embeddable=true&callback=?',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            var input = $(document.createElement('input')).attr({
                type: 'text',
                name: 'stream' + div.attr('id').substr(div.attr('id').length - 1),
                placeholder: 'Enter another channel',
                size: 29
            });
            $.each(data.streams, function (key, stream) {
                div.append(
                    $(document.createElement('input')).attr({
                        id: stream.channel.display_name + div.attr('id').substr(div.attr('id').length - 1),
                        name: 'stream' + div.attr('id').substr(div.attr('id').length - 1),
                        value: stream.channel.display_name,
                        type: 'radio'
                    })
                );

                var label = $(document.createElement('label')).attr({
                    id: stream.channel.display_name + div.attr('id').substr(div.attr('id').length - 1) + '_label',
                    for: stream.channel.display_name + div.attr('id').substr(div.attr('id').length - 1),
                    title: stream.channel.status
                });

                div.append(label);
                label.html(stream.channel.display_name);
                div.append(
                    $(document.createElement('br'))
                );

                //TODO Show LIVE viewers (http://api.justin.tv/api/stream/list.json?channel=)->channel_count
                $(function () {
                    $('#' + $.trim(stream.channel.display_name) + div.attr('id').substr(div.attr('id').length - 1) + '_label').tooltip({
                        hide: null,
                        delay: 0,
                        content: function () {
                            return "<div style='text-align: center; width: 100%;'>" + stream.channel.status + "</div><br><img alt='" + stream.channel.display_name + "' src='" + stream.preview.medium + "' />   ";
                        }
                    });
                });

            });
            hideLoader();
            div.append('<br />');
            div.append(input);
        }
    });
}

function getGames(div) {
    $.ajax({
        url: 'https://api.twitch.tv/kraken/games/top?limit=8&callback=?',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            var gamesholder = $(document.createElement('div')).attr({
                class: 'gamesholder'
            });
            gamesholder.css('width','100%');
            gamesholder.css('text-align','center');
            div.append(gamesholder);

            $.each(data.top, function (key, game_obj) {
                var img = $(document.createElement('img')).attr({
                    class: 'gameimg',
                    src: game_obj.game.box.medium,
                    alt: game_obj.game.name,
                    title: game_obj.game.name + ' [' + game_obj.viewers + ' viewers, ' + game_obj.channels + ' channels]',
                    width: 100,
                    height: 140
                });

                img.css('margin-right', '5px');
                img.css('cursor', 'pointer');
                gamesholder.append(img);
            });
        }
    });
}

$(document).ready(function () {
    getGames($('#div1'));

    $(function() {
        $( document ).tooltip({
            delay: 0
        });
    });

    setTimeout(function() {
        if ($('#loader').css('display') != 'none') {
            $("#loader").delay(10000).append('<br><a href="'+document.URL+'">Reload page</a>');
        }
    }, 10000);

    $("#addcol").click(function() {
        if (($('#div3').css('display') != 'none') && ($('#div4').css('display') == 'none')) {
            $('#div4').show();
            $('#addcol').hide();
        }
        if ($('#div3').css('display') == 'none') {
            $('#div3').show();
        }
    });

    $("#submit").click(function(e) {
        var streamsCount = 0;

        streamsCount += $(':radio:checked', '#form').size();
        $(":text").each(function() {
            if ($(this).val().length > 0) {
                streamsCount++;
            } else {
                $(this).removeAttr('name');
            }
        });

        if (streamsCount < 2 ) {
            e.preventDefault();
            $( "#dialog-message" ).dialog( "open" );
        }
    });

    $('.button').button({
        icons: {
            primary: "ui-icon-home"
        }
    }).next().button({
        icons: {
            primary: "ui-icon-mail-open"
        }
    }).next().button({
        icons: {
            primary: ($.cookie("autoplay") == 0) ? "ui-icon-pause" : "ui-icon-play"
        },
        label: ($.cookie("autoplay") == 0) ? "Auto Play Disabled" : "Auto Play Enabled"
    });

    $('.autoplay').click(function(){
        if ($.cookie("autoplay") == 0) {
            $.cookie("autoplay", 1);
            $(this).button({icons: {primary: "ui-icon-play"}, label: "Auto Play Enabled"})
        } else {
            $.cookie("autoplay", 0);
            $(this).button({icons: {primary: "ui-icon-pause"}, label: "Auto Play Disabled"})
        }
    })

});

$(window).load(function() {
    $('#div2').html($('#div1').html());
    $('#div3').html($('#div1').html());
    $('#div4').html($('#div1').html());

    $('.gameimg').click(function(){
        getStreams($(this).parent().parent(), $(this).attr('alt'));
    });
});