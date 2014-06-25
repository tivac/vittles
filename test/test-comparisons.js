"use strict";

var equal   = require("assert").equal,
    compare = require("../lib/comparisons"),
    quality = compare.quality,
    proper  = compare.proper,
    season  = compare.season,
    episode = compare.episode;

describe.only("Comparisons lib", function() {
    it("should sort items based on quality", function() {
        equal(quality({}, {}), 0);
        equal(quality({ quality : true }, {}), -1);
        equal(quality({}, { quality : true }), 1);

        equal(quality({ quality : "480p" }, { quality : true }), -1);
        equal(quality({ quality : "720p" }, { quality : "480p" }), -1);
        equal(quality({ quality : "1080i" }, { quality : "720p" }), -1);
        equal(quality({ quality : "1080p" }, { quality : "1080i" }), -1);
        equal(quality({ quality : "1080i" }, { quality : "720p" }), -1);
        equal(quality({ quality : "1080p" }, { quality : "480p" }), -3);

        equal(quality({ quality : "480p"}, { quality : "480p"}), 0);
        equal(quality({ quality : "720p"}, { quality : "720p"}), 0);
        equal(quality({ quality : "1080i"}, { quality : "1080i"}), 0);
        equal(quality({ quality : "1080p"}, { quality : "1080p"}), 0);

        equal(quality({ quality : true }, { quality : "480p" }), 1);
        equal(quality({ quality : "480p" }, { quality : "720p" }), 1);
        equal(quality({ quality : "720p" }, { quality : "1080i" }), 1);
        equal(quality({ quality : "1080i" }, { quality : "1080p" }), 1);
        equal(quality({ quality : "720p" }, { quality : "1080i" }), 1);
        equal(quality({ quality : "480p" }, { quality : "1080p" }), 3);
    });

    it("should sort items based on propers", function() {
        equal(proper({}, {}), 0);
        equal(proper({ proper : true }, { proper : true }), 0);
        equal(proper({ proper : true }, {}), -1);
        equal(proper({}, { proper : true }), 1);
    });

    it("should sort items based on season", function() {
        equal(season({}, {}), 0);
        equal(season({ season : 1 }, { season : 1 }), 0);
        equal(season({ season : 1 }, {}), -1);
        equal(season({}, { season : 1 }), 1);
        equal(season({ season : 2 }, { season : 1 }), -1);
        equal(season({ season : 1 }, { season : 4 }), 1);
    });
});
