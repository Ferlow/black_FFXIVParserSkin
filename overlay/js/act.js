var lastData = null;
var parseActive = false;

document.addEventListener("onOverlayDataUpdate", function (e) {
    if (Object.keys(e.detail.Combatant).length > 0) update(e.detail);
});
document.addEventListener("onBroadcastMessageReceive", function (e) {
    switch(e.detail.message) {
        case 'reload':
            location.reload();
            break;
    }
});
document.addEventListener("onLogLine", function (e) {
    switch(e.detail.message) {
        case 'discord':
            pushToDiscord();
            break;
    }
});

function update(data) {
    if ($("#updateNotes").is(":visible")) $("#updateNotes").hide();
    lastData = data;
    updateEncounter(data);
    updateCombatantList(data);
    updateAutoHide();
}

function updateEncounter(data) {
    if (parseActive && parseActFormat("{isActive}", data) == "false") {
        encounterEnd(data);
    }
    $("#encounter").html(parseData(pSettings.current.parserData.title, data.Encounter));
    $("#encounterDetail").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].detail, data.Encounter));
    parseActive = parseActFormat("{isActive}", data) == "true";
    if(parseActive) {
        $("#status").html("In Combat").addClass("active blue-text").removeClass("gold-text");
        $("#combatantWrapper").removeClass("inactive").addClass("active");
    }
    else {
        $("#status").html("Idle").removeClass("active blue-text").addClass("gold-text");
        $("#combatantWrapper").removeClass("active").addClass("inactive");
    }
    
}

function encounterEnd(data) {
    if (pSettings.current.config.discord.autoPost.enable) {
        var post = true;
        if (post && pSettings.current.config.discord.autoPost.minParty.enable) {
            if (Object.keys(data.Combatant).length < parseInt(pSettings.current.config.discord.autoPost.minParty.value)) {
                post = false;
            }
        }
        if (post && pSettings.current.config.discord.autoPost.maxParty.enable) {
            if (Object.keys(data.Combatant).length > parseInt(pSettings.current.config.discord.autoPost.maxParty.value)) {
                post = false;
            }
        }
        if (post && pSettings.current.config.discord.autoPost.minDPS.enable) {
            if (data.Encounter["encdps"] < parseFloat(pSettings.current.config.discord.autoPost.minDPS.value)) {
                post = false;
            }
        }
        if (post && pSettings.current.config.discord.autoPost.minDur.enable) {
            if (data.Encounter["DURATION"] < parseFloat(pSettings.current.config.discord.autoPost.minDur.value)) {
                post = false;
            }
        }
        if (post) {
            pushToDiscord();
        }
    }
}

function updateCombatantList(data) {
    var filteredData = _.sortBy(_.filter(data.Combatant, function (d) {
        return parseInt(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].bar, d), 10) > 0;
    }), function(d)  {
        return -parseInt(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].bar, d), 10);
    }.bind(this));
    
    var table = $("#combatantTable");
    var tableBody;
    if($("#combatantTableBody").length > 0)
        tableBody = $("#combatantTableBody");
    else
        tableBody = $("<tbody>").attr("id", "combatantTableBody").appendTo(table);
    
    tableBody.empty();
        
    var combatantIndex = 0;
    var maxBarBaseVal = 0;
    var smallBars = (pSettings.current.config.general.reducedBarSize.enable && pSettings.current.config.general.reducedBarSize.alwaysEnable) || (pSettings.current.config.general.reducedBarSize.enable && Object.keys(data.Combatant).length > pSettings.current.config.general.reducedBarSize.maxEntries);
    if (smallBars) $("body").addClass("reduced-size");
    else $("body").removeClass("reduced-size");
    for (var combatantName in filteredData) {
        var combatant = filteredData[combatantName];
        
        var curBarBaseVal = parseFloat(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].bar, combatant));

        if (curBarBaseVal > maxBarBaseVal) maxBarBaseVal = curBarBaseVal;
        
        var tableRow = $("<tr>")
            .appendTo(tableBody);
            
        tableRow.addClass(parseData("{job}", combatant));
        tableRow.addClass(parseData("{role}", combatant));
            
        var tableCellLeft;
        if (!smallBars) {
            tableCellLeft = $("<td>").css({ "width": "110px" }).appendTo(tableRow);
        } else {
            tableCellLeft = $("<td>").css({ "width": "130px" }).appendTo(tableRow);
        }
        var tableCellRight = $("<td>").css({ "width": "100%" }).appendTo(tableRow);

        var leftTable = $("<table>").addClass("inner-left-table").appendTo(tableCellLeft);
        var leftTableBody = $("<tbody>").appendTo(leftTable);

        var leftTableTopRow = $("<tr>").appendTo(leftTableBody);
        var leftTableCol = $("<td>").appendTo(leftTableTopRow);
        if (!smallBars) {
            var leftTableSub = $("<div>").addClass("sub-data gold-text").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.info.sub, combatant)).appendTo(leftTableCol);
            var leftTableMain = $("<div>").addClass("main-data gold-text").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.info.main, combatant)).appendTo(leftTableCol);
        } else {
            var leftTableMain = $("<div>").addClass("main-data gold-text").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.info.simple, combatant)).appendTo(leftTableCol);
        }
        
        var icon = parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.icon, combatant);
        
        if (icon !== "") {
            var leftTableDivider = $("<td>").addClass("image").html("<div class=\"" + icon + "\" style=\"background-image: url('../general/icons/" + icon + ".png'); background-size: cover;\"></div>").appendTo(leftTableTopRow);
        } else {
            leftTableCol.css({ "width": "108px" });
        }

        var rightTable = $("<table>").addClass("inner-right-table").appendTo(tableCellRight);
        var rightTableBody = $("<tbody>").appendTo(rightTable);
        var rightTableContainer = $("<td>").appendTo($("<tr>").appendTo(rightTableBody));

        var rightTableWrapper = $("<div>").addClass("inner-wrapper").appendTo(rightTableContainer);
        
        var bgProg = $("<div>").addClass("progBarOutside").appendTo(rightTableWrapper);
        var progBar = $("<div>").addClass("progBar").appendTo(bgProg);
        var percent = ((curBarBaseVal / maxBarBaseVal) * 100);

        progBar.css({"width": percent + "%", "max-width": percent + "%"});
        
        var innerTable = $("<table>").addClass("info-table").appendTo(rightTableWrapper);
        var innerTbody = $("<tbody>").appendTo(innerTable);
        if (!smallBars) {
            var innerRow = $("<tr>").appendTo(innerTbody);
            $("<td>").addClass("info-data").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.bar.tl, combatant)).appendTo(innerRow);
            $("<td>").addClass("info-data").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.bar.tr, combatant)).appendTo(innerRow);
            innerRow = $("<tr>").appendTo(innerTbody);
            $("<td>").addClass("info-data").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.bar.bl, combatant)).appendTo(innerRow);
            $("<td>").addClass("info-data").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.bar.br, combatant)).appendTo(innerRow);
        } else {
            var innerRow = $("<tr>").appendTo(innerTbody);
            $("<td>").addClass("info-data").html(parseData(pSettings.current.parserData.dataSets[pSettings.current.parserData.activeDataSet].data.bar.simple, combatant)).appendTo(innerRow);
        }
        
        combatantIndex++;
    }
}

function parseActFormat(str, dictionary) {
    var result = "";
    
    var currentIndex = 0;
    do {
        var openBraceIndex = str.indexOf('{', currentIndex);
        if (openBraceIndex < 0) {
            result += str.slice(currentIndex);
            break;
        }
        else {
            result += str.slice(currentIndex, openBraceIndex);
            var closeBraceIndex = str.indexOf('}', openBraceIndex);
            if (closeBraceIndex < 0) {
                // parse error!
                console.log("parseActFormat: Parse error: missing close-brace for " + openBraceIndex.toString() + ".");
                return "ERROR";
            }
            else {
                var tag = str.slice(openBraceIndex + 1, closeBraceIndex);
                if (typeof dictionary[tag] !== 'undefined') {
                    result += dictionary[tag];
                } else {
                    console.log("parseActFormat: Unknown tag: " + tag);
                    result += "ERROR";
                }
                currentIndex = closeBraceIndex + 1;
            }
        }
    } while (currentIndex < str.length);
    
    return result;
}