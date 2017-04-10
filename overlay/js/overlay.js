$("#parse-tabs").on("click", "li", function (e) {
    currentParse = parseInt($(e.currentTarget).attr("data-index"));
    $("#parse-tabs li").removeClass("active");
    $("#parse-tabs li[data-index='" + $(e.currentTarget).attr("data-index") + "']").addClass("active");
    if (lastData !== null) {
        updateEncounter(lastData);
        updateCombatantList(lastData);
    }
});

$(document).ready(function () {
    $.each(parseDefine, function (index, def) {
        $("<li>")
            .addClass(index == 0 ? "active" : "")
            .attr({
                "data-index": index
            })
            .html(def.title)
            .appendTo("#parse-tabs");
    });
});

$("#menu-button").on("click", function (e) {
    if ($("#popupMenu").is(":visible")) {
        $("#popupMenu").fadeOut('fast');
    } else {
        $("#popupMenu").fadeIn('fast');
    }
});

$("#popupMenu").on("click", "#minimiseTop", function (e) {
    if ($("body").hasClass("minimised-top")) {
        $("body").removeClass("minimised-top");
        $(e.currentTarget).html("Hide Detailed Top");
    } else {
        $("body").addClass("minimised-top");
        $(e.currentTarget).html("Show Detailed Top");
    }
    $("#popupMenu").fadeOut('fast');
});
$("#popupMenu").on("click", "#reducedSize", function (e) {
    if ($("body").hasClass("reduced-size")) {
        $("body").removeClass("reduced-size");
        $(e.currentTarget).html("Reduced Size");
    } else {
        $("body").addClass("reduced-size");
        $(e.currentTarget).html("Full Size");
    }
    $("#popupMenu").fadeOut('fast');
});
$("#popupMenu").on("click", "#load4Man", function (e) {
    document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', {
        detail: ActFakeData4
    }));
    
    $("#popupMenu").fadeOut('fast');
});
$("#popupMenu").on("click", "#load8Man", function (e) {
    document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', {
        detail: ActFakeData8
    }));
    
    $("#popupMenu").fadeOut('fast');
});
$("#popupMenu").on("click", "#load24Man", function (e) {
    document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', {
        detail: ActFakeData24
    }));
    
    $("#popupMenu").fadeOut('fast');
});