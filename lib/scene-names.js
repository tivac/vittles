/*jshint node:true */

"use strict";

var xregexp   = require("xregexp").XRegExp,
    Tokenizer = require("../lib/tokenizer"),
    scene     = new Tokenizer(),
    regexes   = {
        separator : /[. _-]/,
        digit     : /\d/,
        quality   : /480p|720p|1080i|1080p/
    };

// General plan: More specific first!
scene.rule("proper",    xregexp.build("{{separator}}repack|proper",     regexes, "i"));
scene.rule("extension", xregexp.build("\\.(?<extension>mp4|mkv|avi)",   regexes, "i"));
scene.rule("quality",   xregexp.build("\\[(?<quality>{{quality}})\\]",            regexes, "i"));
scene.rule("quality",   xregexp.build("{{quality}}",                    regexes, "i"));
scene.rule("source",    xregexp.build("HDTV|webrip|bluray|web-dl",      regexes, "i"));
scene.rule("encoder",   xregexp.build("x264|xvid|H.264|AAC2\\.0",       regexes, "i"));
scene.rule("air-date",  xregexp.build("(?<year>{{digit}}{4}){{separator}}+(<?month>{{digit}}{2})(<?day>{{digit}}{2})", regexes, "i"));
scene.rule("season-ep", xregexp.build("s(?<season>{{digit}}+)e(?<episode>{{digit}}+)",  regexes, "i"));
scene.rule("season-ep", xregexp.build("(?<season>{{digit}}+)x(?<episode>{{digit}}+)",   regexes, "i"));
scene.rule("season-ep", xregexp.build("{{separator}}(?!{{quality}})(?<season>{{digit}}+)(?<episode>{{digit}}{2}){{separator}}", regexes, "i"));
scene.rule("season-ep", xregexp.build("{{separator}}(?!{{quality}})(?<episode>{{digit}}+)", regexes, "i"));
scene.rule("group",     xregexp.build("-(?<group>[a-z]+)",          regexes, "i"));
scene.rule("site",      xregexp.build("\\[.+?\\](?={{separator}})", regexes, "i"), { swallow : true });
scene.rule("seperator", xregexp.build("{{separator}}+?",            regexes, "i"), { swallow : true });
scene.rule("title",     xregexp.build("[0-9a-z\\s]+",               regexes, "i"));

exports.parse = function(title) {
    var tokens = scene.tokenize(title),
        details = {
            title  : []
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
        if(token.rule === "season-ep") {
            details.season  = parseInt(token.season, 10) || 1;
            details.episode = parseInt(token.episode, 10);
            
            return;
        }
        
        if(token.rule === "quality") {
            details.quality = token.quality || token.token;
            
            return;
        }
        
        if(token.rule === "proper") {
            details.proper = true;
            
            return;
        }
    });
    
    return details;
};
