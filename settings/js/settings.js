$(document).ready(function () {
    pSettings.load();
    
    if (pSettings.current.config.general.showDetailedHeader) $("[data-setting='use-detailed-header']").addClass("active");
    if (pSettings.current.config.general.reducedBarSize.enable) $("[data-setting='use-reduced-bar-size']").addClass("active");
    else $("[data-setting='use-reduced-bar-size-always']").addClass("disabled")
    $("[data-setting='use-reduced-bar-size'] input").val(pSettings.current.config.general.reducedBarSize.maxEntries);
    if (pSettings.current.config.general.reducedBarSize.alwaysEnable) $("[data-setting='use-reduced-bar-size-always']").addClass("active");
    if (pSettings.current.config.general.autoHide.enable) $("[data-setting='use-auto-hide-parser']").addClass("active");
    $("[data-setting='use-auto-hide-parser'] input").val(pSettings.current.config.general.autoHide.timer);
    if (pSettings.current.config.general.roleBasedColors) $("[data-setting='use-role-colors']").addClass("active");
    if (pSettings.current.config.general.customName.enable) $("[data-setting='use-custom-name']").addClass("active");
    $("[data-setting='use-custom-name'] input").val(pSettings.current.config.general.customName.name);
    if (pSettings.current.config.general.jobNames.enable) $("[data-setting='use-job-names']").addClass("active");
    else $("[data-setting='use-job-names-self']").addClass("disabled");
    if (pSettings.current.config.general.jobNames.self) $("[data-setting='use-job-names-self']").addClass("active");
    $("[data-setting='discord-webhook'] input").val(pSettings.current.config.discord.webhook);
    if (pSettings.current.config.stream.enable) $("[data-setting='use-stream-mode']").addClass("active");
    else {
        $("[data-setting='stream-mode-size-width']").addClass("disabled");
        $("[data-setting='stream-mode-size-height']").addClass("disabled");
    }
    $("[data-setting='stream-mode-size-width'] input").val(pSettings.current.config.stream.size.width);
    $("[data-setting='stream-mode-size-height'] input").val(pSettings.current.config.stream.size.height);
    if (pSettings.current.config.discord.autoPost.enable) $("[data-setting='discord-auto-posting']").addClass("active");
    else {
        $("[data-setting='discord-min-party-size']").addClass("disabled");
        $("[data-setting='discord-max-party-size']").addClass("disabled");
        $("[data-setting='discord-min-dps']").addClass("disabled");
        $("[data-setting='discord-min-duration']").addClass("disabled");
    }
    if (pSettings.current.config.discord.autoPost.minParty.enable) $("[data-setting='discord-min-party-size']").addClass("active");
    $("[data-setting='discord-min-party-size'] input").val(pSettings.current.config.discord.autoPost.minParty.value);
    if (pSettings.current.config.discord.autoPost.maxParty.enable) $("[data-setting='discord-max-party-size']").addClass("active");
    $("[data-setting='discord-max-party-size'] input").val(pSettings.current.config.discord.autoPost.maxParty.value);
    if (pSettings.current.config.discord.autoPost.minDPS.enable) $("[data-setting='discord-min-dps']").addClass("active");
    $("[data-setting='discord-min-dps'] input").val(pSettings.current.config.discord.autoPost.minDPS.value);
    if (pSettings.current.config.discord.autoPost.minDur.enable) $("[data-setting='discord-min-duration']").addClass("active");
    $("[data-setting='discord-min-duration'] input").val(pSettings.current.config.discord.autoPost.minDur.value);
    
    setInterval(function () {
        var w, h;
        if (window.opener != null && window.opener.streamPopup != null) {
            w = window.opener.streamPopup.outerWidth;
            h = window.opener.streamPopup.outerHeight;
        }
        $("[data-setting='stream-mode-current-size'] [data-param='width']").html(w);
        $("[data-setting='stream-mode-current-size'] [data-param='height']").html(h);
    }, 2000);
    
    $(".windowContainer .window-body").perfectScrollbar();
});

$("[data-setting]").on("click", function (e) {
    var obj = $(e.currentTarget);
    if (obj.hasClass("disabled")) return;
    if (obj.hasClass("checkbox")) {
        obj.toggleClass("active");
    }
    switch (obj.attr("data-setting")) {
        case "use-detailed-header":
            pSettings.current.config.general.showDetailedHeader = !pSettings.current.config.general.showDetailedHeader;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-reduced-bar-size":
            pSettings.current.config.general.reducedBarSize.enable = !pSettings.current.config.general.reducedBarSize.enable;
            if (!pSettings.current.config.general.reducedBarSize.enable) {
                $("[data-setting='use-reduced-bar-size-always']").addClass("disabled");
            } else {
                $("[data-setting='use-reduced-bar-size-always']").removeClass("disabled");
            }
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-reduced-bar-size-always":
            pSettings.current.config.general.reducedBarSize.alwaysEnable = !pSettings.current.config.general.reducedBarSize.alwaysEnable;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-auto-hide-parser":
            pSettings.current.config.general.autoHide.enable = !pSettings.current.config.general.autoHide.enable;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-role-colors":
            pSettings.current.config.general.roleBasedColors = !pSettings.current.config.general.roleBasedColors;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-custom-name":
            pSettings.current.config.general.customName.enable = !pSettings.current.config.general.customName.enable;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-job-names":
            pSettings.current.config.general.jobNames.enable = !pSettings.current.config.general.jobNames.enable;
            if (!pSettings.current.config.general.jobNames.enable) {
                $("[data-setting='use-job-names-self']").addClass("disabled");
            } else {
                $("[data-setting='use-job-names-self']").removeClass("disabled");
            }
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-job-names-self":
            pSettings.current.config.general.jobNames.self = !pSettings.current.config.general.jobNames.self;
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-stream-mode":
            pSettings.current.config.stream.enable = !pSettings.current.config.stream.enable;
            $("#apply-settings").removeClass("disabled");
            if (!pSettings.current.config.stream.enable) {
                $("[data-setting='stream-mode-size-width']").addClass("disabled");
                $("[data-setting='stream-mode-size-height']").addClass("disabled");
            } else {
                $("[data-setting='stream-mode-size-width']").removeClass("disabled");
                $("[data-setting='stream-mode-size-height']").removeClass("disabled");
            }
            break;
        case "discord-auto-posting":
            pSettings.current.config.discord.autoPost.enable = !pSettings.current.config.discord.autoPost.enable;
            $("#apply-settings").removeClass("disabled");
            if (!pSettings.current.config.discord.autoPost.enable) {
                $("[data-setting='discord-min-party-size']").addClass("disabled");
                $("[data-setting='discord-max-party-size']").addClass("disabled");
                $("[data-setting='discord-min-dps']").addClass("disabled");
                $("[data-setting='discord-min-duration']").addClass("disabled");
            } else {
                $("[data-setting='discord-min-party-size']").removeClass("disabled");
                $("[data-setting='discord-max-party-size']").removeClass("disabled");
                $("[data-setting='discord-min-dps']").removeClass("disabled");
                $("[data-setting='discord-min-duration']").removeClass("disabled");
            }
            break;
        case "discord-min-party-size":
            pSettings.current.config.discord.autoPost.minParty.enable = !pSettings.current.config.discord.autoPost.minParty.enable;
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-max-party-size":
            pSettings.current.config.discord.autoPost.maxParty.enable = !pSettings.current.config.discord.autoPost.maxParty.enable;
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-min-dps":
            pSettings.current.config.discord.autoPost.minDPS.enable = !pSettings.current.config.discord.autoPost.minDPS.enable;
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-min-duration":
            pSettings.current.config.discord.autoPost.minDur.enable = !pSettings.current.config.discord.autoPost.minDur.enable;
            $("#apply-settings").removeClass("disabled");
            break;
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
            pSettings.current.config.general.autoHide.timer = parseInt(input.val());
            $("#apply-settings").removeClass("disabled");
            break;
        case "use-custom-name":
            pSettings.current.config.general.customName.name = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-webhook":
            $("#test-webhook").text("Test");
            break;
        case "stream-mode-size-width":
            pSettings.current.config.general.stream.size.width = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "stream-mode-size-height":
            pSettings.current.config.general.stream.size.width = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-min-party-size":
            pSettings.current.config.discord.autoPost.minParty.value = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-max-party-size":
            pSettings.current.config.discord.autoPost.maxParty.value = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-min-dps":
            pSettings.current.config.discord.autoPost.minDPS.value = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discord-min-duration":
            pSettings.current.config.discord.autoPost.minDur.value = input.val();
            $("#apply-settings").removeClass("disabled");
            break;
    }
});

$("#apply-settings").on("click", function (e) {
    e.preventDefault();
    if ($(e.currentTarget).hasClass("disabled")) return;
    
    pSettings.save();
    if (typeof OverlayPluginApi !== "undefined") OverlayPluginApi.broadcastMessage('reload');
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
    
    pSettings.defaultArea($(".setting-tabs .active").attr("data-tab"));
    $("#popupNotification").removeClass("show");
    if (typeof OverlayPluginApi !== "undefined") OverlayPluginApi.broadcastMessage('reload');
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
                pSettings.current.config.discord.webhook = url;
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

$(".setting-tabs li").on("click", function (e) {
    $(".setting-tabs li, .window-body-content .settings-panel").removeClass("active");
    $(e.currentTarget).addClass("active");
    var ind = $(".setting-tabs li.active").index();
    $(".window-body-content .settings-panel").eq(ind).addClass("active");
});