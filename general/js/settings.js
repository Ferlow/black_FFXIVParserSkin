var ParserDefaultSettings = {
    version: {
        major: 1,
        minor: 4,
        revision: 0
    },
    parserData: {
        title: "{currentZone}: {title} &middot; {f.b}{duration}{f.eb}",
        activeDataSet: 0,
        template: {
            label: "New Tab",
            detail: "",
            bar: "{damage.raw}",
            data: {
                info: {
                    main: "{damage.ps}",
                    sub: "{damage.percent}",
                    simple: "{damage.ps} {damage.percent}"
                },
                icon: "{job}",
                bar: {
                    tl: "{f.b}{name}{f.eb}",
                    tr: "",
                    bl: "",
                    br: "",
                    simple: "{f.b}{name}{f.eb}"
                }
            }
        },
        dataSets: [
            {
                label: "Damage",
                detail: "Damage {f.b}{damage.total}{f.eb} &middot; Group DPS {f.b}{damage.ps}{f.eb} &middot; Deaths {f.b}{deaths}{f.eb}",
                bar: "{damage.raw}",
                data: {
                    info: {
                        main: "{damage.ps}",
                        sub: "{damage.percent}",
                        simple: "{damage.ps} {damage.percent}"
                    },
                    icon: "{job}",
                    bar: {
                        tl: "{f.b}{name}{f.eb}",
                        tr: "{damage.highest.full}",
                        bl: "{damage.criticals.percent} Crit &middot; {damage.directhit.percent} Dir Hit",
                        br: "",
                        simple: "{f.b}{name}{f.eb} &middot; {damage.criticals.percent} Crit &middot; {damage.directhit.percent} Dir Hit"
                    }
                }
            },
            {
                label: "Healing",
                detail: "Heals {f.b}{healing.total}{f.eb} &middot; Group HPS {f.b}{healing.ps}{f.eb} &middot; Deaths {f.b}{deaths}{f.eb}",
                bar: "{healing.raw}",
                data: {
                    info: {
                        main: "{healing.ps}",
                        sub: "{healing.over} OVER",
                        simple: "{healing.ps}"
                    },
                    icon: "{job}",
                    bar: {
                        tl: "{f.b}{name}{f.eb}",
                        tr: "{healing.highest.full}",
                        bl: "{healing.criticals.percent} Crit",
                        br: "",
                        simple: "{f.b}{name}{f.eb} &middot; {healing.criticals.percent} Crit"
                    }
                }
            },
            {
                label: "Tanking",
                detail: "Damage Taken {f.b}{tanking.total}{f.eb} &middot; Deaths {f.b}{deaths}{f.eb}",
                bar: "{tanking.raw}",
                data: {
                    info: {
                        main: "{tanking.total}",
                        sub: "",
                        simple: ""
                    },
                    icon: "{job}",
                    bar: {
                        tl: "{f.b}{name}{f.eb}",
                        tr: "{tanking.parry} Parry",
                        bl: "",
                        br: "{tanking.block} Block",
                        simple: "{f.b}{name}{f.eb} &middot; {tanking.parry} Parry &middot; {tanking.block} Block"
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
            },
            output: {
                opener: "Encounter       [{currentZone}][{title}]<{duration}>{nl}Encounter DPS   <{damage.ps}>",
                tabLength: 1,
                sorting: "{damage.raw}",
                full: [
                    "JobAndName", "DPS", "DamagePercent", "CritPercent", "DirectHitPercent", "CritDirectHitPercent", "MaxHit"
                ],
                reduced: [
                    "JobAndName", "DPS", "CritPercent", "DirectHitPercent", "CritDirectHitPercent"
                ]
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
            console.log("Loaded default");
        } else {
            var ver = validateVersion(storedData);
            if (!handleVersions(ver)) {
                for (var i in defaults) {
                    if (typeof storedData[i] !== 'undefined') {
                        s.current[i] = settingsLoading(defaults[i], storedData[i]);
                    } else {
                        s.current[i] = defaults[i];
                    }
                }
                localStorage.setItem('parser_settings', JSON.stringify(s.current));
                console.log("Loaded");
            }
        }
    };
    
    s.save = function () {
        localStorage.setItem('parser_settings', JSON.stringify(s.current));
        console.log("Saved");
    };
    
    s.defaults = function () {
        var defaults = JSON.parse(JSON.stringify(ParserDefaultSettings));
        s.current = defaults;
        localStorage.setItem('parser_settings', JSON.stringify(s.current));
        console.log("Defaulted all");
    };
    
    s.defaultArea = function (area) {
        var splitArea = area.split("-");
        if (splitArea.length == 1) {
            s.current[splitArea[0]] = JSON.parse(JSON.stringify(ParserDefaultSettings[splitArea[0]]));
        } else {
            s.current[splitArea[0]][splitArea[1]] = JSON.parse(JSON.stringify(ParserDefaultSettings[splitArea[0]][splitArea[1]]));
        }
        localStorage.setItem('parser_settings', JSON.stringify(s.current));
        console.log("Defaulted " + area);
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
        if (Array.isArray(defaults)) {
            if (!Array.isArray(storedData)) {
                return defaults;
            } else {
                return storedData;
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
}

function validateVersion(storedData) {
    //ParserDefaultSettings.version
    //pSettings.current.version
    
    var ver = {
        latest: false,
        version: {
            major: 0,
            minor: 0,
            revision: 0
        }
    };
    if (typeof storedData.version === "undefined") {
        // No version found, must be pre 1.3
        ver.version.major = 1;
    } else {
        var lat = ParserDefaultSettings.version;
        var cur = storedData.version;
        if ((lat.major == cur.major) && (lat.minor == cur.minor) && (lat.revision == cur.revision)) {
            ver = {
                latest: true,
                version: {
                    major: cur.major,
                    minor: cur.minor,
                    revision: cur.revision
                }
            }
        } else {
            ver = {
                latest: false,
                version: {
                    major: cur.major,
                    minor: cur.minor,
                    revision: cur.revision
                }
            }
        }
    }
    
    storedData.version = ParserDefaultSettings.version;
    
    return ver;
}

function handleVersions(ver) {
    if (ver.version.major <= 1 && ver.version.minor < 4) { // If version is less than 1.4 then reset settings completely
        pSettings.defaults();
        return true;
    }
    return false; // Version didn't need handling
}