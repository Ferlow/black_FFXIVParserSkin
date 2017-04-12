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