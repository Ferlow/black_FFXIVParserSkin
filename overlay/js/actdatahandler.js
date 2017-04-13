var lastData = null;

document.addEventListener("onOverlayDataUpdate", function (e) {
    update(e.detail);
});

function update(data) {
    lastData = data;
    updateEncounter(data);
    updateCombatantList(data);
    updateAutoHide();
}

function updateEncounter(data) {
    $("#encounter").html(parseActFormat(pSettings.current.title, data.Encounter));
    $("#encounterDetail").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].detail, data.Encounter));
    if(parseActFormat("{isActive}", data) == "true") {
        $("#status").html("In Combat").addClass("active blue-text").removeClass("gold-text");
        $("#combatantWrapper").removeClass("inactive").addClass("active");
    }
    else {
        $("#status").html("Idle").removeClass("active blue-text").addClass("gold-text");
        $("#combatantWrapper").removeClass("active").addClass("inactive");
    }
}

function updateCombatantList(data) {
    filteredData = _.sortBy(_.filter(data.Combatant, function (d) {
        return parseInt(d[pSettings.current.dataSets[pSettings.current.activeDataSet].sort], 10) > 0;
    }), function(d)  {
        return -parseInt(d[pSettings.current.dataSets[pSettings.current.activeDataSet].sort], 10);
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
    for (var combatantName in filteredData) {
        var combatant = filteredData[combatantName];
        
        var curBarBaseVal = parseFloat(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].bar, combatant));

        if (curBarBaseVal > maxBarBaseVal) maxBarBaseVal = curBarBaseVal;
        
        var tableRow = $("<tr>").appendTo(tableBody);
        var tableCellLeft;
        if (!pSettings.current.config.useReducedBarSize) {
            tableCellLeft = $("<td>").css({ "width": "110px" }).appendTo(tableRow);
        } else {
            tableCellLeft = $("<td>").css({ "width": "130px" }).appendTo(tableRow);
        }
        var tableCellRight = $("<td>").css({ "width": "100%" }).appendTo(tableRow);

        var leftTable = $("<table>").addClass("inner-left-table").appendTo(tableCellLeft);
        var leftTableBody = $("<tbody>").appendTo(leftTable);

        var leftTableTopRow = $("<tr>").appendTo(leftTableBody);
        var leftTableCol = $("<td>").appendTo(leftTableTopRow);
        if (!pSettings.current.config.useReducedBarSize) {
            var leftTableSub = $("<div>").addClass("sub-data gold-text").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.info.sub, combatant)).appendTo(leftTableCol);
            var leftTableMain = $("<div>").addClass("main-data gold-text").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.info.main, combatant)).appendTo(leftTableCol);
        } else {
            var leftTableMain = $("<div>").addClass("main-data gold-text").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.info.simple, combatant)).appendTo(leftTableCol);
        }
        
        var icon = "";
        if (parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.icon.main, combatant) != "") {
            icon = parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.icon.main, combatant);
        } else if (parseActFormat("{name}", combatant).indexOf("(") != -1) {
            icon = "chocobo";
        } else if (parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.icon.alt, combatant) != "") {
            icon = parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.icon.alt, combatant);
        }
        
        if (icon !== "") {
            var leftTableDivider = $("<td>").addClass("image").html("<div class=\"" + icon.toLowerCase() + "\" style=\"background-image: url('./icons/" + icon + ".png'); background-size: cover;\"></div>").appendTo(leftTableTopRow);
        } else {
            leftTableCol.css({ "width": "108px" });
        }

        var rightTable = $("<table>").addClass("inner-right-table").appendTo(tableCellRight);
        var rightTableBody = $("<tbody>").appendTo(rightTable);
        var rightTableContainer = $("<td>").appendTo($("<tr>").appendTo(rightTableBody));

        var rightTableWrapper = $("<div>").addClass("inner-wrapper").appendTo(rightTableContainer);
        
        var bgProg = $("<div>").addClass("progBarOutside").appendTo(rightTableWrapper);
        var progBar = $("<div>").addClass("progBar " + combatant["Job"]).appendTo(bgProg);
        var percent = ((curBarBaseVal / maxBarBaseVal) * 100);

        progBar.css({"width": percent + "%", "max-width": percent + "%"});
        
        var innerTable = $("<table>").addClass("info-table").appendTo(rightTableWrapper);
        var innerTbody = $("<tbody>").appendTo(innerTable);
        if (!pSettings.current.config.useReducedBarSize) {
            var innerRow = $("<tr>").appendTo(innerTbody);
            $("<td>").addClass("info-data").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.bar.tl, combatant)).appendTo(innerRow);
            $("<td>").addClass("info-data").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.bar.tr, combatant)).appendTo(innerRow);
            innerRow = $("<tr>").appendTo(innerTbody);
            $("<td>").addClass("info-data").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.bar.bl, combatant)).appendTo(innerRow);
            $("<td>").addClass("info-data").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.bar.br, combatant)).appendTo(innerRow);
        } else {
            var innerRow = $("<tr>").appendTo(innerTbody);
            $("<td>").addClass("info-data").html(parseActFormat(pSettings.current.dataSets[pSettings.current.activeDataSet].data.bar.simple, combatant)).appendTo(innerRow);
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

var autoHideTimeout = 0;
function updateAutoHide() {
    if (!pSettings.current.config.autoHideAfterBattle) {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = 0;
    } else if (lastData != null && parseActFormat("{isActive}", lastData) == "false") {
        if (autoHideTimeout == 0) {
            autoHideTimeout = setTimeout(function () {
                $("#combatantWrapper").addClass('auto-hidden');
            }, 30000);
        }
    } else {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = 0;
        if ($("#combatantWrapper").hasClass('auto-hidden')) {
            $("#combatantWrapper").removeClass('auto-hidden');
        }
    }
}