var dataTagsGeneral = [
    {
        tag: "f.b",
        name: "Blue text",
        desc: "Starts a blue text area"
    },
    {
        tag: "f.eb",
        name: "Blue text - End",
        desc: "Stops a blue text area"
    },
    {
        tag: "f.nl",
        name: "New line",
        desc: "Inserts a new line"
    },
    {
        tag: "duration",
        name: "Duration",
        desc: "The duration of the encounter"
    },
    {
        tag: "damage.raw",
        name: "Damage Raw",
        desc: "The damage dealt, unformated"
    },
    {
        tag: "damage.total",
        name: "Damage",
        desc: "The damage dealt, formated"
    },
    {
        tag: "damage.totalk",
        name: "Damage - K",
        desc: "The damage dealt over 1000"
    },
    {
        tag: "damage.ps",
        name: "DPS",
        desc: "The Damage Per Second, formated"
    },
    {
        tag: "damage.psraw",
        name: "DPS",
        desc: "The Damage Per Second, unformated"
    },
    {
        tag: "damage.count",
        name: "Attack count",
        desc: "The number of attacks"
    },
    {
        tag: "damage.highest.full",
        name: "Most damage",
        desc: "The most damaging attack performed"
    },
    {
        tag: "damage.highest.value",
        name: "Most damage - Value",
        desc: "The most damaging attack performed, damage only"
    },
    {
        tag: "damage.accuracy.hits",
        name: "Number of hits",
        desc: "Number of successful hits landed"
    },
    {
        tag: "damage.accuracy.misses",
        name: "Number of misses",
        desc: "Number of hits missed"
    },
    {
        tag: "damage.accuracy.percent",
        name: "Accuracy",
        desc: "The percentage of hits landed"
    },
    {
        tag: "damage.criticals.count",
        name: "Number of critical hits",
        desc: "Number of critical hits landed"
    },
    {
        tag: "damage.criticals.percent",
        name: "Critical Rate",
        desc: "The percentage of critical hits landed"
    },
    {
        tag: "healing.raw",
        name: "Healing Raw",
        desc: "The healing done, unformated"
    },
    {
        tag: "healing.total",
        name: "Healing",
        desc: "The healing done, formated"
    },
    {
        tag: "healing.ps",
        name: "HPS",
        desc: "The Heals Per Second, formated"
    },
    {
        tag: "healing.psraw",
        name: "HPS",
        desc: "The Heals Per Second, unformated"
    },
    {
        tag: "healing.count",
        name: "Heal count",
        desc: "The number of heals performed"
    },
    {
        tag: "healing.highest.full",
        name: "Most healing",
        desc: "The strongest heal performed"
    },
    {
        tag: "healing.highest.value",
        name: "Most healing - Value",
        desc: "The strongest heal performed, value only"
    },
    {
        tag: "healing.criticals.count",
        name: "Number of critical heals",
        desc: "Number of critical heals landed"
    },
    {
        tag: "healing.criticals.percent",
        name: "Critical Heal Rate",
        desc: "The percentage of critical heals landed"
    },
    {
        tag: "tanking.raw",
        name: "Damage Taken Raw",
        desc: "The damage taken, unformated"
    },
    {
        tag: "tanking.total",
        name: "Damage Taken",
        desc: "The damage taken, formated"
    },
    {
        tag: "kills",
        name: "Kills",
        desc: "The number of enemies killed"
    },
    {
        tag: "deaths",
        name: "Deaths",
        desc: "The number of times died"
    },
]
var dataTagsEncounter = [
    {
        tag: "title",
        name: "Title",
        desc: "The title of the encounter"
    },
    {
        tag: "currentZone",
        name: "Current Zone",
        desc: "The name of the current zone"
    },
].concat(dataTagsGeneral);

var dataTagsCombatant = [
    {
        tag: "name",
        name: "Player name",
        desc: "The current players name"
    },
    {
        tag: "name15",
        name: "15 Char Player name",
        desc: "The current players name in 15 letters"
    },
    {
        tag: "job",
        name: "Job",
        desc: "The current players job 3 letter code"
    },
    {
        tag: "longjob",
        name: "Job (Full)",
        desc: "The current players job by it's full name"
    },
    {
        tag: "role",
        name: "Job Role",
        desc: "The current players job role"
    },
    {
        tag: "damage.percent",
        name: "Damage %",
        desc: "The percent of the damage done by this player"
    },
    {
        tag: "damage.directhit.count",
        name: "Number of direct hits",
        desc: "Number of direct hits landed"
    },
    {
        tag: "damage.directhit.percent",
        name: "Direct Hit Rate",
        desc: "The percentage of direct hits landed"
    },
    {
        tag: "damage.critdirecthit.percent",
        name: "Critical Direct Hit Rate",
        desc: "The percentage of critical direct hits landed"
    },
    {
        tag: "healing.percent",
        name: "Healing %",
        desc: "The percent of the healing done by this player"
    },
    {
        tag: "healing.over",
        name: "Over Healing %",
        desc: "The percent of the overhealing healing done by this player"
    },
    {
        tag: "tanking.parry",
        name: "Parry %",
        desc: "The percent of the attacks parried"
    },
    {
        tag: "tanking.block",
        name: "Block %",
        desc: "The percent of the attacks blocked"
    },
].concat(dataTagsGeneral);

// Probably should move these to their own file
function padLeft(s, n) {
    s = s + "";
    return ((s.length >= n) ? s.slice(0, n) : (new Array(n - s.length + 1)).join(" ") + s);
}
function padRight(s, n) {
    s = s + "";
    return ((s.length >= n) ? s.slice(0, n) : s + (new Array(n - s.length + 1)).join(" "));
}

var dataTagsDiscord = {
    "Job": {
        display: function (db) {
            var str = parseData("{job}", db);
            if (str.length > 3) {
                str = str.slice(0, 3);
            }
            return "[" + str.toUpperCase() + "]";
        },
        column: "Job",
        width: 5,
        desc: "Job"
    },
    "Name": {
        tag: "{name15}",
        display: "%s",
        column: "Name",
        minWidth: 15,
        width: 15,
        desc: "Name"
    },
    "JobAndName": {
        display: function (db) {
            var job = parseData("{job}", db);
            var name = parseData("{name15}", db);
            var str = "";
            if (job.length <= 3) {
                str += "[" + job.toUpperCase() + "]";
            }
            str += name;
            str = padRight(str, 20);
            
            return str;
        },
        column: "Name",
        width: 20,
        desc: "Job and Name"
    },
    "DPS": {
        tag: "{damage.psraw}",
        display: "<%s>",
        column: "dps",
        minWidth: 4,
        width: 6,
        padLeft: true,
        desc: "DPS"
    },
    "DamagePercent": {
        tag: "{damage.percent}",
        display: "<%s>",
        column: "dmg%",
        minWidth: 3,
        width: 5,
        padLeft: true,
        desc: "Damage percent"
    },
    "CritPercent": {
        tag: "{damage.criticals.percent}",
        display: "<%s>",
        column: "crit%",
        minWidth: 3,
        width: 5,
        padLeft: true,
        desc: "Critical Hit rate"
    },
    "DirectHitPercent": {
        tag: "{damage.directhit.percent}",
        display: "<%s>",
        column: "dh%",
        minWidth: 3,
        width: 5,
        padLeft: true,
        desc: "Direct Hit rate"
    },
    "CritDirectHitPercent": {
        tag: "{damage.critdirecthit.percent}",
        display: "<%s>",
        column: "critdh%",
        minWidth: 3,
        width: 7,
        padLeft: true,
        desc: "Critical Direct Hit rate"
    },
    "AccuracyPercent": {
        tag: "{damage.accuracy.percent}",
        display: "<%s>",
        column: "acc%",
        minWidth: 3,
        width: 5,
        padLeft: true,
        desc: "Accuracy rate"
    },
    "MaxHit": {
        display: function (db) {
            var hit = parseData("{damage.highest.full}", db).split("-");
            if (hit[0].length > 15) {
                hit[0] = hit[0].slice(0, 7) + "...";
            }                       
            return "[" + padRight(hit[0], 15) + "][" + padLeft(hit[1], 6) + "]";
        },
        column: "max hit",
        width: 25,
        desc: "Highest damage"
    }
};