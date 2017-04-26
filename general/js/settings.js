var ParserDefaultSettings = {
    title: "{currentZone}: {title} &middot; {f.b}{duration}{f./b}",
    activeDataSet: 0,
    dataSets: [
        {
            label: "Damage",
            detail: "Damage {f.b}{damage.total}{f./b} &middot; Group DPS {f.b}{damage.ps}{f./b} &middot; Deaths {f.b}{deaths}{f./b}",
            bar: "{damage.raw}",
            sort: "damage",
            data: {
                info: {
                    main: "{damage.ps}",
                    sub: "{damage.percent}",
                    simple: "{damage.ps} {damage.percent}"
                },
                icon: "{job}",
                bar: {
                    tl: "{f.b}{name}{f./b}",
                    tr: "{damage.highest.full}",
                    bl: "{damage.criticals.percent} Crit &middot; {damage.accuracy.percent}% Acc",
                    br: "",
                    simple: "{f.b}{name}{f./b} &middot; {damage.criticals.percent} Crit &middot; {damage.accuracy.percent}% Acc"
                }
            }
        },
        {
            label: "Healing",
            detail: "Heals {f.b}{healing.total}{f./b} &middot; Group HPS {f.b}{healing.ps}{f./b} &middot; Deaths {f.b}{deaths}{f./b}",
            bar: "{healing.raw}",
            sort: "enchps",
            data: {
                info: {
                    main: "{healing.ps}",
                    sub: "{healing.over} OVER",
                    simple: "{healing.ps}"
                },
                icon: "{job}",
                bar: {
                    tl: "{f.b}{name}{f./b}",
                    tr: "{healing.highest.full}",
                    bl: "{healing.criticals.percent} Crit",
                    br: "",
                    simple: "{f.b}{name}{f./b} &middot; {healing.criticals.percent} Crit"
                }
            }
        },
        {
            label: "Tanking",
            detail: "Damage Taken {f.b}{tanking.total}{f./b} &middot; Deaths {f.b}{deaths}{f./b}",
            bar: "{tanking.raw}",
            sort: "damagetaken",
            data: {
                info: {
                    main: "{tanking.total}",
                    sub: "",
                    simple: ""
                },
                icon: "{job}",
                bar: {
                    tl: "{f.b}{name}{f./b}",
                    tr: "{tanking.parry} Parry",
                    bl: "",
                    br: "{tanking.block} Block",
                    simple: "{f.b}{name}{f./b} &middot; {tanking.parry} Parry &middot; {tanking.block} Block"
                }
            }
        }
    ],
    config: {
        showDetailedHeader: false,
        useReducedBarSize: true,
        reducedBarSizeMaxEntries: 10,
        useReducedBarSizeAlways: false,
        autoHideAfterBattle: false,
        autoHideTimer: 5,
        useCustomName: false,
        customName: "",
        useJobNames: false,
        useJobNamesSelf: false,
        useRoleColors: false,
        allowStreamMode: false,
        streamModeWidth: 800,
        streamModeHeight: 600,
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
    
    s.defaults = function () {
        var defaults = JSON.parse(JSON.stringify(ParserDefaultSettings));
        s.current = defaults;
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