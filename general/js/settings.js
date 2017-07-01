var ParserDefaultSettings = {
    version: {
        major: 1,
        minor: 3,
        revision: 1
    },
    parserData: {
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
                        bl: "{damage.criticals.percent} Crit &middot; {damage.directhit.percent} Dir Hit",
                        br: "",
                        simple: "{f.b}{name}{f./b} &middot; {damage.criticals.percent} Crit &middot; {damage.directhit.percent} Dir Hit"
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
        ]
    },
    config: {
        general: {
            showDetailedHeader: false,
            reducedBarSize: {
                enable: true,
                maxEntries: 10,
                alwaysEnable: false
            },
            autoHide: {
                enable: false,
                timer: 5
            },
            customName: {
                enable: false,
                name: ""
            },
            jobNames: {
                enable: false,
                self: false
            },
            roleBasedColors: false
        },
        stream: {
            enable: false,
            size: {
                width: 800,
                height: 600
            }
        },
        discord: {
            webhook: "",
            autoPost: {
                enable: false,
                minParty: {
                    enable: false,
                    value: 5
                },
                maxParty: {
                    enable: false,
                    value: 8
                },
                minDPS: {
                    enable: false,
                    value: 5000
                },
                minDur: {
                    enable: false,
                    value: 120
                }
            }
        }
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
            /* Simple version upgrading */
            if (typeof storedData.version == "undefined") {
                // Super old version
                s.current = defaults;
                
                convertTo130(s.current, storedData);
                
                localStorage.setItem('parser_settings', JSON.stringify(s.current));
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
    
    s.defaultArea = function (area) {
        var splitArea = area.split("-");
        if (splitArea.length == 1) {
            s.current[splitArea[0]] = JSON.parse(JSON.stringify(ParserDefaultSettings[splitArea[0]]));
        } else {
            s.current[splitArea[0]][splitArea[1]] = JSON.parse(JSON.stringify(ParserDefaultSettings[splitArea[0]][splitArea[1]]));
        }
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

function convertTo130(current, old) {
    current.config.general.showDetailedHeader = old.config.showDetailedHeader;
    current.config.general.reducedBarSize.enable = old.config.useReducedBarSize;
    current.config.general.reducedBarSize.maxEntries = old.config.reducedBarSizeMaxEntries;
    current.config.general.reducedBarSize.alwaysEnable = old.config.useReducedBarSizeAlways;
    current.config.general.autoHide.enable = old.config.autoHideAfterBattle;
    current.config.general.autoHide.timer = old.config.autoHideTimer;
    current.config.general.customName.enable = old.config.useCustomName;
    current.config.general.customName.name = old.config.customName;
    current.config.general.jobNames.enable = old.config.useJobNames;
    current.config.general.jobNames.self = old.config.useJobNamesSelf;
    current.config.general.roleBasedColors = old.config.useRoleColors;
    current.config.stream.enable = old.config.allowStreamMode;
    current.config.stream.size.width = old.config.streamModeWidth;
    current.config.stream.size.height = old.config.streamModeHeight;
    current.config.discord.webhook = old.config.discordWebHook;
}
