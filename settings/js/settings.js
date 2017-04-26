$(document).ready(function () {
    pSettings.load();
    
    if (pSettings.current.config.showDetailedHeader) $("[data-setting='use-detailed-header']").addClass("active");
    if (pSettings.current.config.useReducedBarSize) $("[data-setting='use-reduced-bar-size']").addClass("active");
    else $("[data-setting='use-reduced-bar-size-always']").addClass("disabled")
    $("[data-setting='use-reduced-bar-size'] input").val(pSettings.current.config.reducedBarSizeMaxEntries);
    if (pSettings.current.config.useReducedBarSizeAlways) $("[data-setting='use-reduced-bar-size-always']").addClass("active");
    if (pSettings.current.config.autoHideAfterBattle) $("[data-setting='use-auto-hide-parser']").addClass("active");
    $("[data-setting='use-auto-hide-parser'] input").val(pSettings.current.config.autoHideTimer);
    if (pSettings.current.config.useRoleColors) $("[data-setting='use-role-colors']").addClass("active");
    if (pSettings.current.config.useCustomName) $("[data-setting='use-custom-name']").addClass("active");
    $("[data-setting='use-custom-name'] input").val(pSettings.current.config.customName);
    if (pSettings.current.config.useJobNames) $("[data-setting='use-job-names']").addClass("active");
    else $("[data-setting='use-job-names-self']").addClass("disabled");
    if (pSettings.current.config.useJobNamesSelf) $("[data-setting='use-job-names-self']").addClass("active");
    $("[data-setting='discord-webhook'] input").val(pSettings.current.config.discordWebHook);
    if (pSettings.current.config.allowStreamMode) $("[data-setting='use-stream-mode']").addClass("active");
    else {
        $("[data-setting='stream-mode-size-width']").addClass("disabled");
        $("[data-setting='stream-mode-size-height']").addClass("disabled");
    }
    $("[data-setting='stream-mode-size-width'] input").val(pSettings.current.config.streamModeWidth);
    $("[data-setting='stream-mode-size-height'] input").val(pSettings.current.config.streamModeHeight);
    
    setInterval(function () {
        var w, h;
        if (window.opener.streamPopup != null) {
            w = window.opener.streamPopup.innerWidth;
            h = window.opener.streamPopup.innerHeight;
        }
        $("[data-setting='stream-mode-current-size'] [data-param='width']").html(w);
        $("[data-setting='stream-mode-current-size'] [data-param='height']").html(h);
    }, 2000);
});

$("[data-setting]").on("click", function (e) {
    var obj = $(e.currentTarget);
    if (obj.hasClass("disabled")) return;
    if (obj.hasClass("checkbox")) {
        obj.toggleClass("active");
    }
    switch (obj.attr("data-setting")) {
        case "use-detailed-header":
            pSettings.current.config.showDetailedHeader = !pSettings.current.config.showDetailedHeader;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-reduced-bar-size":
            pSettings.current.config.useReducedBarSize = !pSettings.current.config.useReducedBarSize;
            if (!pSettings.current.config.useReducedBarSize) {
                $("[data-setting='use-reduced-bar-size-always']").addClass("disabled");
            } else {
                $("[data-setting='use-reduced-bar-size-always']").removeClass("disabled");
            }
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-reduced-bar-size-always":
            pSettings.current.config.useReducedBarSizeAlways = !pSettings.current.config.useReducedBarSizeAlways;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-auto-hide-parser":
            pSettings.current.config.autoHideAfterBattle = !pSettings.current.config.autoHideAfterBattle;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-role-colors":
            pSettings.current.config.useRoleColors = !pSettings.current.config.useRoleColors;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-custom-name":
            pSettings.current.config.useCustomName = !pSettings.current.config.useCustomName;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-job-names":
            pSettings.current.config.useJobNames = !pSettings.current.config.useJobNames;
            if (!pSettings.current.config.useJobNames) {
                $("[data-setting='use-job-names-self']").addClass("disabled");
            } else {
                $("[data-setting='use-job-names-self']").removeClass("disabled");
            }
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-job-names-self":
            pSettings.current.config.useJobNamesSelf = !pSettings.current.config.useJobNamesSelf;
            $("#apply-settings").removeClass("disabled");
        case "use-stream-mode":
            pSettings.current.config.allowStreamMode = !pSettings.current.config.allowStreamMode;
            $("#apply-settings").removeClass("disabled");
            if (!pSettings.current.config.allowStreamMode) {
                $("[data-setting='stream-mode-size-width']").addClass("disabled");
                $("[data-setting='stream-mode-size-height']").addClass("disabled");
            } else {
                $("[data-setting='stream-mode-size-width']").removeClass("disabled");
                $("[data-setting='stream-mode-size-height']").removeClass("disabled");
            }
            break
    }
});
$("[data-setting]").on("click", "input", function (e) {
    e.stopPropagation();
});
$("[data-setting]").on("input", "input", function (e) {
    var obj = $(e.currentTarget).closest("[data-setting]");
    var input = $(e.currentTarget);
    
    if (obj.hasClass("disabled")) return;
    
    switch (obj.attr("data-setting")) {
        case "use-auto-hide-parser":
            pSettings.current.config.autoHideTimer = parseInt(input.val());
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-custom-name":
            pSettings.current.config.customName = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-webhook":
            $("#test-webhook").text("Test");
            break;
        case "stream-mode-size-width":
            pSettings.current.config.streamModeWidth = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "stream-mode-size-height":
            pSettings.current.config.streamModeHeight = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
    }
});

$("#apply-settings").on("click", function (e) {
    e.preventDefault();
    if ($(e.currentTarget).hasClass("disabled")) return;
    
    pSettings.save();
    OverlayPluginApi.broadcastMessage('reload');
    location.reload();
});
$("#close-settings").on("click", function (e) {
    e.preventDefault();
    window.close();
});
$("#default-settings").on("click", function (e) {
    e.preventDefault();
    
    $("#popupNotification").addClass("show");
});

$("#confirmation-yes").on("click", function (e) {
    e.preventDefault();
    
    pSettings.defaults();
    $("#popupNotification").removeClass("show");
    OverlayPluginApi.broadcastMessage('reload');
    location.reload();
});
$("#confirmation-no").on("click", function (e) {
    e.preventDefault();
    
    $("#popupNotification").removeClass("show");
});

$("#test-webhook").on("click", function (e) {
    e.preventDefault();
    
    var url = $("[data-setting='discord-webhook'] input").val();

    if (url == "") {
        $("#test-webhook").text("Failed");
        return;
    }
    if (url.indexOf("discordapp.com/api/webhooks/") == -1) {
        $("#test-webhook").text("Failed");
        return;
    }
    
    $.ajax({
        url: url,
        type: "GET",
        success: function (e) {
            if (typeof e.id !== "undefined") {
                pSettings.current.config.discordWebHook = url;
                $("#test-webhook").text("Success");
                $("#apply-settings").removeClass("disabled");
            } else {
                $("#test-webhook").text("Failed");
            }
        },
        error: function (i,j,k) {
            $("#test-webhook").text("Failed");
            console.log(i,j,k);
        }
    })
});