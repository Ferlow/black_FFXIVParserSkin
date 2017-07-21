var streamPopup = null;

$("#parse-tabs").on("click", "li", function (e) {
    pSettings.current.parserData.activeDataSet = parseInt($(e.currentTarget).attr("data-index"));
    $("#parse-tabs li").removeClass("active");
    $("#parse-tabs li[data-index='" + $(e.currentTarget).attr("data-index") + "']").addClass("active");
    if (lastData !== null) {
        updateEncounter(lastData);
        updateCombatantList(lastData);
    }
});

$(document).ready(function () {
    pSettings.load();
    
    $.each(pSettings.current.parserData.dataSets, function (index, def) {
        $("<li>")
            .addClass(index == 0 ? "active" : "")
            .attr({
                "data-index": index
            })
            .html(def.label)
            .appendTo("#parse-tabs");
    });
    
    if (pSettings.current.config.general.showDetailedHeader) $("body").addClass("detailed-header");
    if (pSettings.current.config.general.roleBasedColors) $("body").addClass("role-colors");
    if (!pSettings.current.config.stream.enable) $(".stream-mode").hide();
    if (getParameterByName("stream") == "true") $("body").addClass("stream-mode");
    if (pSettings.current.config.discord.webhook !== "") $("[data-id='pushToDiscord']").show();
    
    updateAutoHide();
    
    $("#combatantWrapper #tableWrapper").perfectScrollbar();
});

$("#menu-button").on("click", function (e) {
    if ($("#popupMenu").is(":visible")) {
        $("#popupMenu").fadeOut('fast');
    } else {
        $("#popupMenu").fadeIn('fast');
    }
});

$("#popupMenu").on("click", "li", function (e) {
    if ($(e.currentTarget).hasClass("disabled")) return;
    $("#popupMenu").fadeOut('fast', function () {
        switch ($(e.currentTarget).attr("data-id")) {
            case "pushToDiscord":
                pushToDiscord();
                break;
            case "settings":
                window.open('../settings/','Parser - Settings','width=800,height=600');
                break;
            case "hideOverlay":
                hideOverlay();
                break;
            case "showOverlay":
                showOverlay();
                break;
            case "openStreamMode":
                streamPopup = window.open('./index.html?stream=true','Stream Mode','width=' + pSettings.current.config.stream.size.width + ',height=' + pSettings.current.config.stream.size.width);
                streamPopup.onbeforeunload = function () {
                    streamPopup = null;
                }
                streamPopup.onresize = function () {
                    
                }
                break;
            case "load4Man":
                document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', {
                    detail: ActFakeData4
                }));
                break;
            case "load8Man":
                document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', {
                    detail: ActFakeData8
                }));
                break;
            case "load24Man":
                document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', {
                    detail: ActFakeData24
                }));
                break;
        }
    });
});

var autoHideTimeout = 0;
var autoHideStopped = false;
function updateAutoHide() {
    if (!pSettings.current.config.general.autoHide.enable || $("body").hasClass("stream-mode")) {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = 0;
    } else if (lastData != null && parseActFormat("{isActive}", lastData) == "false") {
        if (autoHideTimeout == 0) {
            autoHideTimeout = setTimeout(function () {
                $("#combatantWrapper").addClass('auto-hidden');
            }, pSettings.current.config.general.autoHide.timer * 1000);
        }
    } else if (lastData == null) {
        if (autoHideTimeout == 0) {
            autoHideTimeout = setTimeout(function () {
                $("#combatantWrapper").addClass('auto-hidden');
            }, pSettings.current.config.general.autoHide.timer * 1000);
        }
    } else if (!autoHideStopped) {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = 0;
        if ($("#combatantWrapper").hasClass('auto-hidden')) {
            $("#combatantWrapper").removeClass('auto-hidden');
        }
    }
}
function showOverlay() {
    $("#combatantWrapper").removeClass('auto-hidden');
    autoHideTimeout = setTimeout(function () {
        autoHideTimeout = 0;
        updateAutoHide();
    }, 15 * 1000);
}
function hideOverlay() {
    clearTimeout(autoHideTimeout);
    autoHideTimeout = 0;
    $("#combatantWrapper").addClass('auto-hidden');
    autoHideStopped = true;
    setTimeout(function () {
        autoHideStopped = false;
    }, 15 * 1000);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}