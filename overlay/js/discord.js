function pushToDiscord() {
    if (pSettings.current.config.discord.webhook == "") return;
    if (lastData == null) return;

    $.ajax({
        url: pSettings.current.config.discord.webhook,
        type: "POST",
        contentType: 'multipart/form-data',
        data: JSON.stringify({
            "username": "FFXIV Parse",
            "avatar_url": "https://ihellmasker.github.io/FFXIVParserSkin/general/icons/webhook.png",
            "content": "```MD\n" + buildDiscordString() + "\n```"
        })
    });
}

function buildDiscordString() {
    var tags;
    if (Object.keys(lastData.Combatant).length <= 10) {
        tags = pSettings.current.config.discord.output.full;
    } else {
        tags = pSettings.current.config.discord.output.reduced;
    }
    
    var output = "";
    output += parseData(pSettings.current.config.discord.output.opener, lastData.Encounter);
    output += "\n" + _buildDiscordTableHeader(tags);
    
    var filteredData = _.sortBy(_.filter(lastData.Combatant, function (d) {
        return parseInt(parseData(pSettings.current.config.discord.output.sorting, d), 10) > 0;
    }), function(d)  {
        return -parseInt(parseData(pSettings.current.config.discord.output.sorting, d), 10);
    }.bind(this));

    $.each(filteredData, function (index, combatant) {
        output += "\n" + _buildDiscordTableRow(tags, combatant);
    });

    return output;
}

function _buildDiscordTableHeader(tags) {
    var output = "";
    $.each(tags, function (index, tag) {
        if (typeof dataTagsDiscord[tag] == "undefined") return "Error occured generating header";
        
        if (typeof dataTagsDiscord[tag].column !== "undefined") {
            var colTag = (index == 0 ? "#" : "") + dataTagsDiscord[tag].column;
            if (typeof dataTagsDiscord[tag].width !== "undefined") {
                colTag = padRight(colTag, dataTagsDiscord[tag].width);
            }
            output += colTag;
        }
        
        output += (new Array(pSettings.current.config.discord.output.tabLength + 1)).join(" ");
    });
    
    return output;
}

function _buildDiscordTableRow(tags, combatant) {
    var output = "";
    $.each(tags, function (index, tag) {
        if (typeof dataTagsDiscord[tag] === "undefined" || typeof dataTagsDiscord[tag].display === "undefined") return "Error occured generating row";
        
        if (typeof dataTagsDiscord[tag].display === "function") {
            output += dataTagsDiscord[tag].display(combatant);
        } else if (typeof dataTagsDiscord[tag].display === "string") {
            var value = parseData(dataTagsDiscord[tag].tag, combatant).replace("%", "");
            value = isNaN(value) ? value : value | 0;
            
            if (typeof dataTagsDiscord[tag].minWidth !== "undefined") {
                if (typeof dataTagsDiscord[tag].padLeft === "undefined" || !dataTagsDiscord[tag].padLeft) {
                    value = padRight(value, dataTagsDiscord[tag].minWidth);
                } else {
                    value = padLeft(value, dataTagsDiscord[tag].minWidth);
                }
            }
            
            output += dataTagsDiscord[tag].display.replace("%s", value);
        }
        
        output += (new Array(pSettings.current.config.discord.output.tabLength + 1)).join(" ");
    });
    
    return output;
}