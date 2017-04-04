var parseDefine = [
    {
        title: "Damage",
        encounter: "{title} &middot; {duration}",
        detail: "<em>Damage</em> {damage} &middot; <em>Group DPS</em> {dps} &middot; <em>Deaths</em> {deaths}",
        bar: "{damage}",
        sort: "damage",
        data: {
            primary: {
                text: "{encdps}"
            },
            sub: {
                text: "{damage%}"
            },
            divider: {
                img: "{Job}",
                altImg: "{name}"
            },
            barTL: {
                text: "{name}"
            },
            barTR: {
                text: "{maxhit}"
            },
            barBL: {
                text: "{crithit%} Crit &middot; {tohit}% Acc"
            },
            barBR: {
                text: ""
            }
        }
    },
    {
        title: "Healing",
        encounter: "{title} &middot; {duration} &middot; {ENCHPS} <small>team hps</small>",
        detail: "<em>Heals</em> {healed} &middot; <em>Group HPS</em> {enchps} &middot; <em>Deaths</em> {deaths}",
        bar: "{enchps}",
        sort: "enchps",
        data: {
            primary: {
                text: "{enchps}"
            },
            sub: {
                text: "{OverHealPct} OVER"
            },
            divider: {
                img: "{Job}",
                altImg: "{name}"
            },
            barTL: {
                text: "{name}"
            },
            barTR: {
                text: "{maxheal}"
            },
            barBL: {
                text: "{critheal%} CRIT"
            },
            barBR: {
                text: ""
            }
        }
    },
    {
        title: "Tanking",
        encounter: "{title} &middot; {duration}",
        detail: "<em>Damage Taken</em> {damagetaken} &middot; <em>Deaths</em> {deaths}",
        bar: "{damagetaken}",
        sort: "damagetaken",
        data: {
            primary: {
                text: "{damagetaken}"
            },
            sub: {
                text: ""
            },
            divider: {
                img: "{Job}",
                altImg: "{name}"
            },
            barTL: {
                text: "{name}"
            },
            barTR: {
                text: "{ParryPct} PARRY"
            },
            barBL: {
                text: ""
            },
            barBR: {
                text: "{BlockPct} BLOCK"
            }
        }
    }
];