var parseDefine = [
    {
        title: "Damage",
        encounter: "{title} &middot; {duration} &middot; {ENCDPS} <small>team dps</small>",
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
                img: "{Job}"
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
                img: "{Job}"
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