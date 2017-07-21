var job_details = {
    "acn": {
        role: "dps",
        name: "Arcanist"
    },
    "smn": {
        role: "dps",
        name: "Summoner"
    },
    "arc": {
        role: "dps",
        name: "Archer"
    },
    "brd": {
        role: "dps",
        name: "Bard"
    },
    "blm": {
        role: "dps",
        name: "Black Mage"
    },
    "thm": {
        role: "dps",
        name: "Thaumaturge"
    },
    "drg": {
        role: "dps",
        name: "Dragoon"
    },
    "lnc": {
        role: "dps",
        name: "Lancer"
    },
    "pgl": {
        role: "dps",
        name: "Pugilist"
    },
    "mnk": {
        role: "dps",
        name: "Monk"
    },
    "mch": {
        role: "dps",
        name: "Machinist"
    },
    "rog": {
        role: "dps",
        name: "Rogue"
    },
    "nin": {
        role: "dps",
        name: "Ninja"
    },
    "rdm": {
        role: "dps",
        name: "Red Mage"
    },
    "sam": {
        role: "dps",
        name: "Samurai"
    },
    "ast": {
        role: "heal",
        name: "Astrologian"
    },
    "cnj": {
        role: "heal",
        name: "Conjurer"
    },
    "whm": {
        role: "heal",
        name: "White Mage"
    },
    "sch": {
        role: "heal",
        name: "Scholar"
    },
    "drk": {
        role: "tank",
        name: "Dark Knight"
    },
    "mrd": {
        role: "tank",
        name: "Marauder"
    },
    "war": {
        role: "tank",
        name: "Warrior"
    },
    "gla": {
        role: "tank",
        name: "Gladiator"
    },
    "pld": {
        role: "tank",
        name: "Paladin"
    }
};
var dataMapping = {
    f: {
        b: "<b>",
        eb: "</b>",
        nl: "\n"
    },
    name: function (db) {
        if (typeof db["name"] !== "undefined") {
            if (pSettings.current.config.useJobNames && (pSettings.current.config.useJobNamesSelf || db["name"] !== "YOU")) {
                if (typeof db["Job"] !== "undefined" && db["Job"] != "") {
                    return job_details[db["Job"].toLowerCase()].name;
                } else if (typeof db["name"] !== "undefined" && db["name"].indexOf("(") != -1) {
                    return "Chocobo";
                } else {
                    return db["name"];
                }
            } else {
                if (db["name"] === "YOU" && pSettings.current.config.useCustomName) {
                    return pSettings.current.config.customName;
                } else {
                    return db["name"];
                }
            }
        }
    },
    name15: "NAME15",
    job: function (db) {
        if (typeof db["Job"] !== "undefined" && db["Job"] != "") {
            return db["Job"].toLowerCase();
        } else if (typeof db["name"] !== "undefined" && db["name"].indexOf("(") != -1) {
            return "pet";
        } else {
            return db["name"].replace(" ", "").toLowerCase();
        }
    },
    longjob: function (db) {
        if (typeof db["Job"] !== "undefined" && db["Job"] != "") {
            return job_details[db["Job"].toLowerCase()].name;
        } else if (typeof db["name"] !== "undefined" && db["name"].indexOf("(") != -1) {
            return "Chocobo";
        } else {
            return db["name"];
        }
    },
    role: function (db) {
        if (db["Job"] != "") {
            return job_details[db["Job"].toLowerCase()].role;
        }
    },
    title: "title",
    duration: "duration",
    currentZone: "CurrentZoneName",
    damage: {
        raw: function (db) {
            return parseFloat(db["damage"]);
        },
        total: function (db) {
            return parseFloat(db["damage"]).toLocaleString();
        },
        totalk: function (db) {
            return parseFloat(db["DAMAGE-K"]).toLocaleString();
        },
        ps: function (db) {
            return parseFloat(db["encdps"]).toLocaleString();
        },
        psraw: function (db) {
            return parseFloat(db["encdps"]);
        },
        count: "swings",
        percent: "damage%",
        highest: {
            full: "maxhit",
            value: "MAXHIT"
        },
        accuracy: {
            hits: "hits",
            misses: "misses",
            percent: "tohit"
        },
        criticals: {
            count: "crithits",
            percent: "crithit%"
        },
        directhit: {
            count: "DirectHitCount",
            percent: "DirectHitPct"
        },
        critdirecthit: {
            percent: "CritDirectHitPct"
        }
    },
    healing: {
        raw: function (db) {
            return parseFloat(db["healed"]);
        },
        total: function (db) {
            return parseFloat(db["healed"]).toLocaleString();
        },
        ps: function (db) {
            return parseFloat(db["enchps"]).toLocaleString();
        },
        psraw: function (db) {
            return parseFloat(db["enchps"]);
        },
        count: "heals",
        percent: "healed%",
        over: "OverHealPct",
        highest: {
            full: "maxheal",
            value: "MAXHEAL"
        },
        criticals: {
            count: "critheals",
            percent: "critheal%"
        }
    },
    tanking: {
        raw: function (db) {
            return parseFloat(db["damagetaken"]);
        },
        total: function (db) {
            return parseFloat(db["damagetaken"]).toLocaleString();
        },
        parry: "ParryPct",
        block: "BlockPct",
    },
    kills: "kills",
    deaths: "deaths"
}
function parseData(str, db) {
    var re = /\{([^}]+)\}/g;
    var matches = [], loop;
    var result = str;
    
    while ((loop = re.exec(str)) !== null) {
        matches.push(loop[1]);
    }
    
    for (var i = 0; i < matches.length; i++) {
        var value = "";
        var split = matches[i].split(".");

        result = result.replace("{"+matches[i]+"}", parseDataDeep(split, dataMapping, db));
    }
    
    return result;
}
function parseDataDeep(arr, map, db) {
    var result = "";
    if (typeof map[arr[0]] !== "undefined") {
        if (typeof map[arr[0]] == "string") {
            result = db[map[arr[0]]];
        } else if (typeof map[arr[0]] == "function") {
            result = map[arr[0]](db);
        } else if (typeof map[arr[0]] == "object") {
            if (arr[0] !== "f") {
                result = parseDataDeep(arr.splice(1), map[arr[0]], db);
            } else {
                result = map[arr[0]][arr[1]];
            }
        }
    } else {
        result = "ERR";
    }
    
    return result;
}
