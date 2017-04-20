var ParserDefaultSettings = {
    title: "{CurrentZoneName} {title} &middot; {duration}",
    activeDataSet: 0,
    dataSets: [
        {
            label: "Damage",
            detail: "Damage <b>{damage}</b> &middot; Group DPS <b>{dps}</b> &middot; Deaths <b>{deaths}</b>",
            bar: "{damage}",
            sort: "damage",
            data: {
                info: {
                    main: "{encdps}",
                    sub: "{damage%}",
                    simple: "{encdps} {damage%}"
                },
                icon: {
                    main: "{Job}",
                    alt: "{name}"
                },
                bar: {
                    tl: "<b>{name}</b>",
                    tr: "{maxhit}",
                    bl: "{crithit%} Crit &middot; {tohit}% Acc",
                    br: "",
                    simple: "<b>{name}</b> &middot; {crithit%} Crit &middot; {tohit}% Acc &middot; {maxhit}"
                }
            }
        },
        {
            label: "Healing",
            detail: "<em>Heals</em> {healed} &middot; <em>Group HPS</em> {enchps} &middot; <em>Deaths</em> {deaths}",
            bar: "{enchps}",
            sort: "enchps",
            data: {
                info: {
                    main: "{enchps}",
                    sub: "{OverHealPct} OVER",
                    simple: "{enchps}"
                },
                icon: {
                    main: "{Job}",
                    alt: "{name}"
                },
                bar: {
                    tl: "<b>{name}</b>",
                    tr: "{maxheal}",
                    bl: "{critheal%} Crit",
                    br: "",
                    simple: "<b>{name}</b> &middot; {maxheal} &middot; {critheal%} Crit"
                }
            }
        },
        {
            label: "Tanking",
            detail: "<em>Damage Taken</em> {damagetaken} &middot; <em>Deaths</em> {deaths}",
            bar: "{damagetaken}",
            sort: "damagetaken",
            data: {
                info: {
                    main: "{damagetaken}",
                    sub: "",
                    simple: ""
                },
                icon: {
                    main: "{Job}",
                    alt: "{name}"
                },
                bar: {
                    tl: "<b>{name}</b>",
                    tr: "{ParryPct} Parry",
                    bl: "",
                    br: "{BlockPct} Block",
                    simple: "<b>{name}</b> &middot; {ParryPct} Parry &middot; {BlockPct} Block"
                }
            }
        }
    ],
    config: {
        showDetailedHeader: true,
        useReducedBarSize: false,
        autoHideAfterBattle: false,
        autoHideTimer: 5,
        useCustomName: false,
        customName: "",
        useJobNames: false,
        useRoleColors: false,
        discordWebHook: ""
    }
};

var pConf = ParserDefaultSettings;

var pSettings = new function () {
    var s = this;

    s.current = {};

    s.load = function () {
        var defaults = JSON.parse(JSON.stringify(ParserDefaultSettings));
        var storedJSON = localStorage.getItem('parser_settings');
        var storedData;
        
        try {
            storedData = JSON.parse(storedJSON);
        } catch (e) {
            storedData = null;
        }
        
        if (!storedData) {
            localStorage.setItem('parser_settings', JSON.stringify(defaults));
            s.current = defaults;
        } else {
            for (var i in defaults) {
                if (i == 'dataSets') {
                    if (storedData[i].length == 0) {
                        s.current[i] = defaults[i];
                    } else {
                        s.current[i] = storedData[i];
                    }
                } if (typeof storedData[i] !== 'undefined') {
                    s.current[i] = settingsLoading(defaults[i], storedData[i]);
                } else {
                    s.current[i] = defaults[i];
                }
            }
            localStorage.setItem('parser_settings', JSON.stringify(s.current));
        }
    };
    
    s.save = function () {
        localStorage.setItem('parser_settings', JSON.stringify(s.current));
    };

    /* Constructor */
    s.pSettings = function () {

    }();
}

function settingsLoading(defaults, storedData) {
    if (typeof defaults !== 'object') {
        if (typeof storedData == "undefined") {
            return defaults;
        } else {
            return storedData
        }
    } else {
        var ret = {};
        for (var i in defaults) {
            if (typeof storedData !== 'undefined') {
                ret[i] = settingsLoading(defaults[i], storedData[i]);
            } else {
                ret[i] = defaults[i];
            }
        }
        return ret;
    }
}