/*jshint node:true */

"use strict";

var async     = require("async"),
    xregexp   = require("xregexp").XRegExp,
    Tokenizer = require("../lib/tokenizer"),
    scene     = new Tokenizer(),
    extract   = /^File: (.*) Thread:/,
    regexes   = {
        separator : /[. _-]/,
        digit     : /\d/
    };

// General plan: More specific first!
scene.rule("proper",    xregexp.build("{{separator}}repack|proper",     regexes, "i"));
scene.rule("extension", xregexp.build("\\.(?<extension>mp4|mkv|avi)",   regexes, "i"));
scene.rule("quality",   xregexp.build("720p|1080p|1080i",               regexes, "i"));
scene.rule("source",    xregexp.build("HDTV|webrip|bluray|web-dl",      regexes, "i"));
scene.rule("encoder",   xregexp.build("x264|xvid|H.264|AAC2\\.0",       regexes, "i"));
scene.rule("air-date",  xregexp.build("(?<year>{{digit}}{4})[. _-]+(<?month>{{digit}}{2})(<?day>{{digit}}{2})", regexes, "i"));
scene.rule("season-ep", xregexp.build("s(?<season>{{digit}}+)e(?<episode>{{digit}}+)",  regexes, "i"));
scene.rule("season-ep", xregexp.build("(?<season>{{digit}}+)x(?<episode>{{digit}}+)",   regexes, "i"));
scene.rule("season-ep", xregexp.build("{{separator}}(?<season>{{digit}}+?)(?<episode>{{digit}}{2}){{separator}}", regexes, "i"));
scene.rule("group",     xregexp.build("-(?<group>\\w+)",        regexes, "i"));
scene.rule("site",      xregexp.build("\\[.+\\]{{separator}}",  regexes, "i"), { swallow : true });
scene.rule("seperator", xregexp.build("{{separator}}+",         regexes, "i"), { swallow : true });
scene.rule("title",     xregexp.build("[a-z0-9]+",              regexes, "i"));

module.exports = function(config, done) {
    async.map(
        config.entries,
        function(entry, cb) {
            var title = entry.title.trim();
        
            if(title.search(extract) > -1) {
                title = title.match(extract)[1];
            }
            
            scene.tokenize(title, function(error, tokens) {
                var details = {
                        title  : [],
                        source : entry
                    };
                
                if(error) {
                    config.log("warn", "Unable to parse " + title);
                    
                    return cb(title);
                }
                
                // Title is all "title" tokens at the beginning of the name
                tokens.some(function(token) {
                    if(token.rule !== "title") {
                        return true;
                    }
                    
                    details.title.push(token.token);
                });
                
                details.title = details.title.join(" ");
    
                tokens.forEach(function(token) {
                    if(token.rule === "season-ep") {
                        details.season  = token.season;
                        details.episode = token.episode;
                        
                        return;
                    }
                    
                    if(token.rule === "quality") {
                        details.quality = token.token;
                        
                        return;
                    }
                    
                    if(token.rule === "proper") {
                        details.proper = true;
                        
                        return;
                    }
                });
                
                cb(null, details);
            });
        },
        function(error, results) {
            if(error) {
                return done(error);
            }
            
            console.log(results);
            
            config.parsed = results;
            
            done();
        }
    );
};

