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
    
    _menuDetailedHeader($(".popup-menu-list li[data-id='minimiseTop']"));
    _menuReducedSize($(".popup-menu-list li[data-id='reducedSize']"));
    _menuToggleCheckbox(pSettings.current.config.autoHideAfterBattle, $(".popup-menu-list li[data-id='autoHide']"));
    _menuToggleCheckbox(pSettings.current.config.useCustomName, $(".popup-menu-list li[data-id='useCustomName']"));
    _menuToggleCheckbox(pSettings.current.config.useJobNames, $(".popup-menu-list li[data-id='useJobNames']"));
    _menuToggleCheckbox(pSettings.current.config.useRoleColors, $(".popup-menu-list li[data-id='useRoleColors']"));
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
            case "minimiseTop":
                pSettings.current.config.showDetailedHeader = !pSettings.current.config.showDetailedHeader;
                _menuDetailedHeader($(e.currentTarget));
                pSettings.save();
                break;
            case "reducedSize":
                pSettings.current.config.useReducedBarSize = !pSettings.current.config.useReducedBarSize;
                _menuReducedSize($(e.currentTarget));
                pSettings.save();
                if (lastData !== null) {
                    updateEncounter(lastData);
                    updateCombatantList(lastData);
                }
                break;
            case "autoHide":
                pSettings.current.config.autoHideAfterBattle = !pSettings.current.config.autoHideAfterBattle;
                _menuToggleCheckbox(pSettings.current.config.autoHideAfterBattle, $(e.currentTarget));
                pSettings.save();
                updateAutoHide();
                break;
            case "useCustomName":
                pSettings.current.config.useCustomName = !pSettings.current.config.useCustomName;
                _menuToggleCheckbox(pSettings.current.config.useCustomName, $(e.currentTarget));
                pSettings.save();
                break;
            case "useJobNames":
                pSettings.current.config.useJobNames = !pSettings.current.config.useJobNames;
                _menuToggleCheckbox(pSettings.current.config.useJobNames, $(e.currentTarget));
                pSettings.save();
                break;
            case "useRoleColors":
                pSettings.current.config.useRoleColors = !pSettings.current.config.useRoleColors;
                _menuUseRoleColors($(e.currentTarget));
                pSettings.save();
                break;
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
                    output += "#Name                dps    dmg%  crit% acc%      max hit\n";
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
                        "content": output
                    })
                });
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

function _menuToggleCheckbox(setting, obj) {
    if (setting) obj.addClass("active");
    else obj.removeClass("active");
}
function _menuDetailedHeader(obj) {
    _menuToggleCheckbox(pSettings.current.config.showDetailedHeader, obj);
    if (pSettings.current.config.showDetailedHeader) $("body").addClass("detailed-header");
    else $("body").removeClass("detailed-header");
}
function _menuReducedSize(obj) {
    _menuToggleCheckbox(pSettings.current.config.useReducedBarSize, obj);
    if (pSettings.current.config.useReducedBarSize) $("body").addClass("reduced-size");
    else $("body").removeClass("reduced-size");
}
function _menuUseRoleColors(obj) {
    _menuToggleCheckbox(pSettings.current.config.useRoleColors, obj);
    if (pSettings.current.config.useReducedBarSize) $("body").addClass("role-colors");
    else $("body").removeClass("role-colors");
}

var autoHideTimeout = 0;
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
    } else {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = 0;
        if ($("#combatantWrapper").hasClass('auto-hidden')) {
            $("#combatantWrapper").removeClass('auto-hidden');
        }
    }
}

function webhook(str) {
    if (str.indexOf("discordapp.com/api/webhooks/") == -1) return;
    
    $.ajax({
        url: pSettings.current.config.discordWebHook,
        type: "GET",
        success: function (e) {
            if (typeof e.id !== "undefined") {
                console.log("Webhook validated");
                pSettings.current.config.discordWebHook = str;
                pSettings.save();
            } else {
                console.log("Webhook invalid");
            }
        }
    })
}