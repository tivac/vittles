/*jshint node:true */

"use strict";

var xregexp   = require("xregexp").XRegExp,
    Tokenizer = require("../lib/tokenizer"),
    scene     = new Tokenizer(),
    regexes   = {
        separator : /[. _\-\s]/,
        digit     : /\d/,
        quality   : /480p|720p|1080i|1080p/
    };

// More complicated values need to be built
regexes.episode = xregexp.build("{{digit}}+",   regexes, "i");
regexes.season  = xregexp.build("{{digit}}+",   regexes, "i");
regexes.year    = xregexp.build("{{digit}}{4}", regexes, "i");
regexes.month   = xregexp.build("{{digit}}{2}", regexes, "i");
regexes.day     = xregexp.build("{{digit}}{2}", regexes, "i");

// General plan: More specific first!
[
    [ "proper",     "repack|proper" ],
    [ "extension",  "\\.(?<extension>mp4|mkv|avi)" ],
    [ "quality",    "\\[({{quality}})\\]" ],
    [ "quality",    "{{quality}}" ],
    [ "source",     "HDTV|webrip|bluray|web-dl" ],
    [ "encoder",    "x264|xvid|H\\.264|AAC2\\.0|DD5\\.1" ],
    [ "air-date",   "({{year}}){{separator}}({{month}}){{separator}}({{day}})" ],
    [ "season-ep",  "s({{season}})e({{episode}})" ],
    [ "season-ep",  "({{season}})x({{episode}})" ],
    [ "title",      "[0-9a-z]+" ],
    [ "season-ep",  "(?!{{quality}})({{season}})(?<episode>{{digit}}{2})(?={{separator}})" ],
    [ "season-ep",  "(?!{{quality}})({{episode}})(?={{separator}})" ],
    [ "group",      "-(?<group>[a-z]+)" ],
    [ "site",       "\\[.+?\\](?={{separator}})", { swallow : true } ],
    [ "seperator",  "{{separator}}+?", { swallow : true } ],
].forEach(function(rule) {
    scene.rule.call(scene, rule[0], xregexp.build(rule[1], regexes, "i"), rule[2]);
});

exports.parse = function(title) {
    var tokens = scene.tokenize(title),
        details = {
            title : []
        };
    
    if(tokens instanceof Error) {
        return tokens;
    }
    
    // Title is all "title" tokens at the beginning of the name
    tokens.some(function(token) {
        if(token.rule !== "title") {
            return true;
        }
        
        details.title.push(token.token);
    });
    
    details.title = details.title.join(" ").trim();

    tokens.forEach(function(token) {
        switch(token.rule) {
            case "season-ep" :
                details.season  = parseInt(token.season, 10) || 1;
                details.episode = parseInt(token.episode, 10);
                break;

            case "quality" :
                details.quality = token.quality || token.token;
                break;

            case "proper" :
                details.proper = true;
                break;

            case "air-date" :
                details.airdate = {
                    year  : parseInt(token.year, 10),
                    month : parseInt(token.month, 10),
                    day   : parseInt(token.day, 10)
                };
                break;
        }
    });
    
    return details;
};
