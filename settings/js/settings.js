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
    
    loadDataToEditable(pSettings.current.parserData.title, "[data-setting='parserTab-title']", dataTagsEncounter);
    loadDataToEditable(pSettings.current.config.discord.output.opener, "[data-setting='discordTab-opening-line']", dataTagsEncounter);
    loadDataToEditable(pSettings.current.config.discord.output.sorting, "[data-setting='discordTab-sorting']", dataTagsCombatant);
    
    $.each(pSettings.current.parserData.dataSets, function (index, tab) {
        var li = $("<li>")
            .text(tab.label)
            .insertBefore("#add-new-tab");
            
        if (index == 0) li.addClass("active");
    });
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

$(".textarea[data-setting]").on("input", function (e) {
    textAreaEdit(e);
});
$(".textarea[data-setting]").on("inserted.atwho", function (e) {
    textAreaEdit(e);
})
function textAreaEdit(e) {
    var obj = $(e.currentTarget);
    
    if (obj.hasClass("disabled")) return;
    
    switch (obj.attr("data-setting")) {
        case "parserTab-title":
            pSettings.current.parserData.title = obj.text();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discordTab-opening-line":
            pSettings.current.config.discord.output.opener = obj.text();
            $("#apply-settings").removeClass("disabled");
            break;
        case "discordTab-sorting":
            pSettings.current.config.discord.output.sorting = obj.text();
            $("#apply-settings").removeClass("disabled");
            break;
    }
};

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
    
    $(".popupNotification.defaultSettings").addClass("show");
});

$(".defaultSettings .confirmation-yes").on("click", function (e) {
    e.preventDefault();
    
    pSettings.defaultArea($(".setting-tabs .active").attr("data-tab"));
    $(".popupNotification.defaultSettings").removeClass("show");
    if (typeof OverlayPluginApi !== "undefined") OverlayPluginApi.broadcastMessage('reload');
    location.reload();
});
$(".confirmation-no").on("click", function (e) {
    e.preventDefault();
    
    $(".popupNotification").removeClass("show");
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
    
    if ($(e.currentTarget).hasClass("datasets")) {
        loadDataSetTab();
    }
    if ($(e.currentTarget).hasClass("discord")) {
        loadDiscordColumns();
    }
    
    $(".windowContainer .window-body").scrollTop(0);
    $(".windowContainer .window-body").perfectScrollbar('update');
});

$(".parser-tabs-wrapper .parser-tabs").on("click", "li", function (e) {
    $(".parser-tabs-wrapper .parser-tabs li").removeClass("active");
    $(e.currentTarget).addClass("active");
    loadDataSetTab();
});

$(".discord-tabs-wrapper .discord-tabs").on("click", "li:not(#add-new-tab)", function (e) {
    $(".discord-tabs-wrapper .discord-tabs li").removeClass("active");
    $(e.currentTarget).addClass("active");
    loadDiscordColumns();
});

$("#add-new-tab").on("click", function (e) {
    pSettings.current.parserData.dataSets[Object.keys(pSettings.current.parserData.dataSets).length] = JSON.parse(JSON.stringify(ParserDefaultSettings.parserData.template));
    var li = $("<li>")
        .text("New Tab")
        .insertBefore("#add-new-tab");
        
    pSettings.save();
});

$("#delete-current-parserTab").on("click", function (e) {
    $(".popupNotification.dataTabs").addClass("show");
});

$(".dataTabs .confirmation-yes").on("click", function (e) {
    e.preventDefault();
    
    var ind = $(".parser-tabs-wrapper .parser-tabs li.active").index();
    
    pSettings.current.parserData.dataSets.splice(ind, 1);
    
    $(".parser-tabs-wrapper .parser-tabs li.active").remove();
    
    $(".parser-tabs-wrapper .parser-tabs li:first").addClass("active");
    
    loadDataSetTab();

    $(".popupNotification.dataTabs").removeClass("show");
    
    pSettings.save();
    
    broadcastMessage('reload');
});

$("#cancel-current-parserTab").on("click", function (e) {
    loadDataSetTab();
});

$("#save-current-parserTab").on("click", function (e) {
    var ind = $(".parser-tabs-wrapper .parser-tabs li.active").index();
    $(".parser-tabs-wrapper .parser-tabs li.active").text($("[data-setting='parserTab-data-label']").text());

    pSettings.current.parserData.dataSets[ind].label = $("[data-setting='parserTab-data-label']").text();
    pSettings.current.parserData.dataSets[ind].detail = $("[data-setting='parserTab-data-detail']").text();
    pSettings.current.parserData.dataSets[ind].bar = $("[data-setting='parserTab-data-bar']").text();
    pSettings.current.parserData.dataSets[ind].data.info.main = $("[data-setting='parserTab-data-info-main']").text();
    pSettings.current.parserData.dataSets[ind].data.info.sub = $("[data-setting='parserTab-data-info-sub']").text();
    pSettings.current.parserData.dataSets[ind].data.info.simple = $("[data-setting='parserTab-data-info-simple']").text();
    pSettings.current.parserData.dataSets[ind].data.icon = $("[data-setting='parserTab-data-icon']").text();
    pSettings.current.parserData.dataSets[ind].data.bar.tl = $("[data-setting='parserTab-data-bar-tl']").text();
    pSettings.current.parserData.dataSets[ind].data.bar.tr = $("[data-setting='parserTab-data-bar-tr']").text();
    pSettings.current.parserData.dataSets[ind].data.bar.bl = $("[data-setting='parserTab-data-bar-bl']").text();
    pSettings.current.parserData.dataSets[ind].data.bar.br = $("[data-setting='parserTab-data-bar-br']").text();
    pSettings.current.parserData.dataSets[ind].data.bar.simple = $("[data-setting='parserTab-data-bar-simple']").text();
    
    $("#apply-settings").removeClass("disabled");
});

$(".discord-tab-data-container .column ul").on("click", "li", function (e) {
    $(".discord-tab-data-container .column ul li").removeClass("selected");
    $(e.currentTarget).addClass("selected");
});

$(".discord-tab-data-container .column.control-buttons").on("click", ".button", function (e) {
    switch ($(e.currentTarget).attr("data-action")) {
        case "left":
            if ($(".discord-tab-data-container .column ul li.selected").closest(".column").hasClass("inactive-columns")) {
                $(".discord-tab-data-container .column ul li.selected").appendTo(".discord-tab-data-container .column.active-columns ul");
            }
            break;
        case "right":
            if ($(".discord-tab-data-container .column ul li.selected").closest(".column").hasClass("active-columns")) {
                $(".discord-tab-data-container .column ul li.selected").appendTo(".discord-tab-data-container .column.inactive-columns ul");
            }
            break;
        case "up":
            before = $(".discord-tab-data-container .column ul li.selected").prev();
            $(".discord-tab-data-container .column ul li.selected").insertBefore(before);
            break;
        case "down":
            after = $(".discord-tab-data-container .column ul li.selected").next();
            $(".discord-tab-data-container .column ul li.selected").insertAfter(after);
            break;
    }
    
    saveDiscordColumns();
    var len = calculateDiscordLineLength();
    $(".message-length-estimate .line-length").text(len);
    $(".message-length-estimate .message-length").text(len * ($(".discord-tabs-wrapper .discord-tabs li.active").index() === 0 ? 10 : 25));
});

function saveDiscordColumns() {
    var tags = [];
    
    $(".discord-tab-data-container .active-columns ul li").each(function (i, col) {
        tags.push($(col).attr("data-tag"));
    });
    
    if ($(".discord-tabs-wrapper .discord-tabs li.active").index() === 0) {
        pSettings.current.config.discord.output.full = tags;
    } else {
        pSettings.current.config.discord.output.reduced = tags;
    }
}

function calculateDiscordLineLength() {
    var tags = $(".discord-tabs-wrapper .discord-tabs li.active").index() === 0 ? pSettings.current.config.discord.output.full : pSettings.current.config.discord.output.reduced;
    
    var len = 0;
    
    for (var tag in tags) {
        len += dataTagsDiscord[tags[tag]].width;
    }
    
    len += pSettings.current.config.discord.output.tabLength * (tags.length - 1)
    
    return len;
}

function loadDataToEditable(data, editable, autocomplete) {
    var autocomplete = autocomplete || null;
    data = autocomplete == null ? data : data.replace(/{/g, "<span class=\"atwho-inserted\" contenteditable=\"false\">{").replace(/}/g, "}</span>");
    $(editable).html(data);
    if (autocomplete !== null) {
        $(editable).atwho({
            at: "{",
            displayTpl: "<li>${name} <small>${desc}</li>",
            insertTpl: "{${tag}}",
            limit: 200,
            searchKey: "tag",
            suffix: "",
            callbacks: {
                beforeReposition: function(offset) {
                    offset.top += 23;
                    return offset;
                },
            },
            data: autocomplete
        });
    }
}

function loadDataSetTab() {
    var ind = $(".parser-tabs-wrapper .parser-tabs li.active").index();
    var dataSet = pSettings.current.parserData.dataSets[ind];
    
    loadDataToEditable(dataSet.label, "[data-setting='parserTab-data-label']");
    loadDataToEditable(dataSet.detail, "[data-setting='parserTab-data-detail']", dataTagsCombatant);
    loadDataToEditable(dataSet.bar, "[data-setting='parserTab-data-bar']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.info.main, "[data-setting='parserTab-data-info-main']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.info.sub, "[data-setting='parserTab-data-info-sub']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.info.simple, "[data-setting='parserTab-data-info-simple']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.icon, "[data-setting='parserTab-data-icon']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.bar.tl, "[data-setting='parserTab-data-bar-tl']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.bar.tr, "[data-setting='parserTab-data-bar-tr']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.bar.bl, "[data-setting='parserTab-data-bar-bl']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.bar.br, "[data-setting='parserTab-data-bar-br']", dataTagsCombatant);
    loadDataToEditable(dataSet.data.bar.simple, "[data-setting='parserTab-data-bar-simple']", dataTagsCombatant);
}

function loadDiscordColumns() {
    var tags = $(".discord-tabs-wrapper .discord-tabs li.active").index() === 0 ? pSettings.current.config.discord.output.full : pSettings.current.config.discord.output.reduced;
    
    $(".discord-tab-data-container .active-columns ul, .discord-tab-data-container .inactive-columns ul").empty();
    
    for (var tag in dataTagsDiscord) {
        var column = $("<li>")
            .attr("data-tag", tag)
            .text(dataTagsDiscord[tag].desc);
        if (tags.indexOf(tag) !== -1) { // Found
            column.appendTo(".discord-tab-data-container .active-columns ul");
        } else { // Not found
            column.appendTo(".discord-tab-data-container .inactive-columns ul");
        }
    }
    
    var len = calculateDiscordLineLength();
    $(".message-length-estimate .line-length").text(len);
    $(".message-length-estimate .message-length").text(len * ($(".discord-tabs-wrapper .discord-tabs li.active").index() === 0 ? 10 : 25));
}