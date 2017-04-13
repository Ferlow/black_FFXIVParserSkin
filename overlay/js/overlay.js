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
            case "customName":
                break;
            case "useJobNames":
                break;
            case "pushToDiscord":
                if (pSettings.current.config.discordWebHook == "") return;
                var output = "";
                output += "```MD\n";
                output += "Encounter          [" + parseActFormat("{title}", lastData.Encounter) + "][" + parseActFormat("{duration}", lastData.Encounter) + "]\n";
                output += "Encounter DPS      <" + parseActFormat("{dps}", lastData.Encounter) + ">\n";
                output += "#Name           dps    dmg%  crit% acc%      max hit\n";
                
                var tab = " ";
                
                filteredData = _.sortBy(_.filter(lastData.Combatant, function (d) {
                    return parseInt(d[pSettings.current.dataSets[pSettings.current.activeDataSet].sort], 10) > 0;
                }), function(d)  {
                    return -parseInt(d[pSettings.current.dataSets[pSettings.current.activeDataSet].sort], 10);
                }.bind(this));

                for (var combatantName in filteredData) {
                    var combatant = filteredData[combatantName];
                    
                    output += (parseActFormat("{NAME15}", combatant) + "               ").slice(0, 15);
                    output += tab;
                    output += "<" + ("    " + parseActFormat("{DPS}", combatant)).slice(-4) + ">";
                    output += tab;
                    output += "<" + ("   " + parseActFormat("{damage%}", combatant).slice(0, -1)).slice(-3) + ">";
                    output += tab;
                    output += "<" + ("   " + parseActFormat("{crithit%}", combatant).slice(0, -1)).slice(-3) + ">";
                    output += tab;
                    output += "<" + ("       " + parseActFormat("{tohit}", combatant).slice(0, -1)).slice(-7) + ">";
                    output += tab;
                    output += "[" + parseActFormat("{maxhit}", combatant).replace("-", "][") + "]";
                    output += "\n";
                }
    
                output += "```";
                
                $.ajax({
                    url: pSettings.current.config.discordWebHook,
                    type: "POST",
                    contentType: 'multipart/form-data',
                    data: JSON.stringify({
                        "content": output
                    }),
                    error: function (i,j,k) {
                        console.log(i,j,k);
                    }
                })
                break;
            case "autoHide":
                pSettings.current.config.autoHideAfterBattle = !pSettings.current.config.autoHideAfterBattle;
                _menuToggleCheckbox(pSettings.current.config.autoHideAfterBattle, $(e.currentTarget));
                pSettings.save();
                updateAutoHide();
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

function webhook(str) {
    if (str.indexOf("discordapp.com/api/webhooks/") == -1) return;
    pSettings.current.config.discordWebHook = str;
    pSettings.save();
}