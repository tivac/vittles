"use strict";

var xregexp   = require("xregexp").XRegExp,
    Tokenizer = require("../lib/tokenizer"),
    scene     = new Tokenizer(),
    regexes   = {
        separator : /[. _\-\s]/,
        digit     : /\d/,
        quality   : /480p|720p|1080i|1080p/
    };

// More complicated values need to be built so they can use the replacements
regexes.episode = xregexp.build("{{digit}}+",   regexes, "i");
regexes.season  = xregexp.build("{{digit}}+",   regexes, "i");
regexes.year    = xregexp.build("{{digit}}{4}", regexes, "i");
regexes.month   = xregexp.build("{{digit}}{2}", regexes, "i");
regexes.day     = xregexp.build("{{digit}}{2}", regexes, "i");

regexes.sepend  = xregexp.build("(?={{separator}})", regexes, "i");

// General plan: More specific first!
[
    [ "proper",     "repack|proper{{sepend}}" ],
    [ "extension",  "\\.(?<extension>mp4|mkv|avi)" ],
    [ "quality",    "\\[({{quality}})\\]" ],
    [ "quality",    "{{quality}}" ],
    [ "source",     "HDTV|webrip|bluray|web-dl" ],
    [ "encoder",    "x264|xvid|H\\.264|AAC2\\.0|DD5\\.1" ],
    // 2014.09.09
    [ "air-date",   "({{year}}){{separator}}({{month}}){{separator}}({{day}})" ],
    // s01e04
    [ "season-ep",  "s({{season}})e({{episode}})" ],
    // 01x05
    [ "season-ep",  "({{season}})x({{episode}})" ],
    // 104
    [ "season-ep",  "(?!{{quality}})({{season}})(?<episode>{{digit}}{2}){{sepend}}" ],
    // 04
    [ "episode",    "(?!{{quality}})({{episode}}){{sepend}}" ],
    // -DIMENSION
    [ "group",      "-(?<group>[a-z]+)" ],
    // [gg], [ASDAFASF]
    [ "site",       "\\[.+?\\]{{sepend}}", { swallow : true } ],
    [ "seperator",  "{{separator}}+?", { swallow : true } ],
    [ "title",      "[0-9a-z]+" ],
].forEach(function(rule) {
    scene.rule.call(scene, rule[0], xregexp.build(rule[1], regexes, "i"), rule[2]);
});

module.exports = scene;
