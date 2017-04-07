var lastData = null;
var currentParse = 0;

document.addEventListener("onOverlayDataUpdate", function (e) {
    update(e.detail);
});

function update(data) {
    lastData = data;
    updateEncounter(data);
    updateCombatantList(data);
}

function updateEncounter(data) {
    $("#encounter").html(parseActFormat(parseDefine[currentParse].encounter, data.Encounter));
    $("#encounterDetail").html(parseActFormat(parseDefine[currentParse].detail, data.Encounter));
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
        return parseInt(d[parseDefine[currentParse].sort], 10) > 0;
    }), function(d)  {
        return -parseInt(d[parseDefine[currentParse].sort], 10);
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
        
        var curBarBaseVal = parseFloat(parseActFormat(parseDefine[currentParse].bar, combatant));

        if (curBarBaseVal > maxBarBaseVal) maxBarBaseVal = curBarBaseVal;
        
        var tableRow = $("<tr>").appendTo(tableBody);
        var tableCellLeft = $("<td>").css({ "width": "110px" }).appendTo(tableRow);
        var tableCellRight = $("<td>").css({ "width": "100%" }).appendTo(tableRow);

        var leftTable = $("<table>").addClass("inner-left-table").appendTo(tableCellLeft);
        var leftTableBody = $("<tbody>").appendTo(leftTable);

        var leftTableTopRow = $("<tr>").appendTo(leftTableBody);
        var leftTableCol = $("<td>").appendTo(leftTableTopRow);
        var leftTableSub = $("<div>").addClass("sub-data gold-text").html(parseActFormat(parseDefine[currentParse].data.sub.text, combatant)).appendTo(leftTableCol);
        var leftTableMain = $("<div>").addClass("main-data gold-text").html(parseActFormat(parseDefine[currentParse].data.primary.text, combatant)).appendTo(leftTableCol);
        
        if (parseActFormat(parseDefine[currentParse].data.divider.img, combatant) != "") {
            var leftTableDivider = $("<td>").addClass("image")/*.attr("rowspan", 2)*/.html("<div class=\"" + parseActFormat(parseDefine[currentParse].data.divider.img, combatant) + "\" style=\"background-image: url('./icons/" + parseActFormat(parseDefine[currentParse].data.divider.img, combatant) + ".png'); background-size: cover;\"></div>").appendTo(leftTableTopRow);
        } else if (parseActFormat(parseDefine[currentParse].data.divider.altImg, combatant) != "") {
            var leftTableDivider = $("<td>").addClass("image")/*.attr("rowspan", 2)*/.html("<div class=\"" + parseActFormat(parseDefine[currentParse].data.divider.img, combatant) + "\" style=\"background-image: url('./icons/" + parseActFormat(parseDefine[currentParse].data.divider.altImg, combatant) + ".png'); background-size: cover;\"></div>").appendTo(leftTableTopRow);
        }
        else {
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
        var innerRow = $("<tr>").appendTo(innerTbody);
        $("<td>").addClass("info-data tl blue-text").html(parseActFormat(parseDefine[currentParse].data.barTL.text, combatant)).appendTo(innerRow);
        $("<td>").addClass("info-data tr gold-text").html(parseActFormat(parseDefine[currentParse].data.barTR.text, combatant)).appendTo(innerRow);
        var innerRow = $("<tr>").appendTo(innerTbody);
        $("<td>").addClass("info-data bl gold-text").html(parseActFormat(parseDefine[currentParse].data.barBL.text, combatant)).appendTo(innerRow);
        $("<td>").addClass("info-data br gold-text").html(parseActFormat(parseDefine[currentParse].data.barBR.text, combatant)).appendTo(innerRow);
        
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