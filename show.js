$(document).ready(function () {
    function getStreamStatus(channel) {
        $.ajax({
            url: 'https://api.twitch.tv/kraken/channels/'+channel+'?callback=?',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                $('#status_'+channel).html(data.status);
            }
        });
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace('#', '');
        parts = parts.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function (m, key, value) {
                vars[key] = value;
            });
        return vars;
    }

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
    });

    for (var i = 1; i <= 4; i++) {
        var val = getUrlVars()["stream"+i];
        if (val) {
            var autoplay = ($.cookie("autoplay") == 0) ? "false" : "true";
            $('#stream'+i).append('<span id="status_'+val+'">'+status+'</span>');
            $('#stream'+i).append('<object class="video" type="application/x-shockwave-flash" height="378" width="600" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+val+'" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+val+'&auto_play='+autoplay+'&start_volume=25" /></object>');
            $('#stream'+i).css('visibility', 'visible');
            $('#chat'+i).append('<span>'+val+'\'s chat</span><div class="ui-state-default ui-corner-all close-button" style="float: right; cursor: pointer; overflow: hidden;"><span class="ui-icon ui-icon-circle-minus" title="close chat"></span></div>');
            $('#chat'+i).append('<iframe frameborder="1" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel='+val+'&amp;popout_chat=true" height="400" width="100%"></iframe>');
            $('#chat'+i).css('visibility', 'visible');
            getStreamStatus(val);
        }
    }

    $('.stream').draggable({cancel: "object" });

    $('.close-button').click(function(){
        if ($(this).parent().height() > 100) {
            $(this).find("span").removeClass("ui-icon-circle-minus");
            $(this).find("span").addClass("ui-icon-circle-plus");
            $(this).parent().height(20);
            $(this).parent().find("iframe").css("visibility", "hidden");
        } else {
            $(this).find("span").removeClass("ui-icon-circle-plus");
            $(this).find("span").addClass("ui-icon-circle-minus");
            $(this).parent().height("auto");
            $(this).parent().find("iframe").css("visibility", "visible");
        }
    });
});