var streamPopup = null;

$("#parse-tabs").on("click", "li", function (e) {
    pSettings.current.activeDataSet = parseInt($(e.currentTarget).attr("data-index"));
    $("#parse-tabs li").removeClass("active");
    $("#parse-tabs li[data-index='" + $(e.currentTarget).attr("data-index") + "']").addClass("active");
    if (lastData !== null) {
        updateEncounter(lastData);
        updateCombatantList(lastData);
    }
});

$(document).ready(function () {
    pSettings.load();
    
    $.each(pSettings.current.dataSets, function (index, def) {
        $("<li>")
            .addClass(index == 0 ? "active" : "")
            .attr({
                "data-index": index
            })
            .html(def.label)
            .appendTo("#parse-tabs");
    });
    
    if (pSettings.current.config.showDetailedHeader) $("body").addClass("detailed-header");
    if (pSettings.current.config.useRoleColors) $("body").addClass("role-colors");
    if (!pSettings.current.config.allowStreamMode) $(".stream-mode").hide();
    if (getParameterByName("stream") == "true") $("body").addClass("stream-mode");
    
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
                if (pSettings.current.config.discordWebHook == "") return;
                if (lastData == null) return;
                var tab = " ";
                var lastLength = 0;
                var fullDetail = Object.keys(lastData.Combatant).length <= 17;
                var output = "";
                output += "```MD\n";
                output += "Encounter       [" + parseActFormat("{CurrentZoneName}", lastData.Encounter) + "][" + parseActFormat("{title}", lastData.Encounter) + "]<" + parseActFormat("{duration}", lastData.Encounter) + ">\n";
                output += "Encounter DPS   <" + parseActFormat("{dps}", lastData.Encounter) + ">\n";
                if (fullDetail) {
                    output += "#Name                dps    dmg%  crit% acc%     max hit\n";
                } else {
                    output += "#Name                dps    dmg%  crit% acc%\n";
                }
                                
                filteredData = _.sortBy(_.filter(lastData.Combatant, function (d) {
                    return parseInt(d[pSettings.current.dataSets[pSettings.current.activeDataSet].sort], 10) > 0;
                }), function(d)  {
                    return -parseInt(d[pSettings.current.dataSets[pSettings.current.activeDataSet].sort], 10);
                }.bind(this));
                
                lastLength = output.length;

                for (var combatantName in filteredData) {
                    var combatant = filteredData[combatantName];
                    var currentLine = "";
                    var job = parseActFormat("{Job}", combatant);
                    
                    currentLine += job.length > 0 ? "[" + job + "]" : "";
                    currentLine += (parseActFormat("{NAME15}", combatant) + "               ").slice(0, 15);
                    currentLine += job.length > 0 ? "" : "     ";
                    currentLine += tab;
                    currentLine += "<" + ("    " + parseActFormat("{ENCDPS}", combatant)).slice(-4) + ">";
                    currentLine += tab;
                    currentLine += "<" + ("   " + parseActFormat("{damage%}", combatant).slice(0, -1)).slice(-3) + ">";
                    currentLine += tab;
                    currentLine += "<" + ("   " + parseActFormat("{crithit%}", combatant).slice(0, -1)).slice(-3) + ">";
                    currentLine += tab;
                    currentLine += "<" + ("      " + parseActFormat("{tohit}", combatant)).slice(-6) + ">";
                    if (fullDetail) {
                        currentLine += tab;
                        currentLine += "[" + parseActFormat("{maxhit}", combatant).replace("-", "][") + "]";
                    }
                    currentLine += "\n";
                    
                    if (currentLine.length + lastLength < 1996) {
                        output += currentLine;
                    }
                }
    
                output += "```";
                
                $.ajax({
                    url: pSettings.current.config.discordWebHook,
                    type: "POST",
                    contentType: 'multipart/form-data',
                    data: JSON.stringify({
                        "username": "FFXIV Parse",
                        "avatar_url": "https://ihellmasker.github.io/FFXIVParserSkin/general/icons/webhook.png",
                        "content": output
                    })
                });
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
                streamPopup = window.open('./index.html?stream=true','Stream Mode','width=' + pSettings.current.config.streamModeWidth + ',height=' + pSettings.current.config.streamModeHeight);
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
    if (!pSettings.current.config.autoHideAfterBattle) {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = 0;
    } else if (lastData != null && parseActFormat("{isActive}", lastData) == "false") {
        if (autoHideTimeout == 0) {
            autoHideTimeout = setTimeout(function () {
                $("#combatantWrapper").addClass('auto-hidden');
            }, pSettings.current.config.autoHideTimer * 1000);
        }
    } else if (lastData == null) {
        if (autoHideTimeout == 0) {
            autoHideTimeout = setTimeout(function () {
                $("#combatantWrapper").addClass('auto-hidden');
            }, pSettings.current.config.autoHideTimer * 1000);
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