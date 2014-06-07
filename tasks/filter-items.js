/*jshint node:true */

"use strict";

var async     = require("async"),
    xregexp   = require("xregexp").XRegExp,
    Tokenizer = require("../lib/tokenizer"),
    scene     = new Tokenizer(),
    extract   = /^File: (.*) Thread:/;

scene.rule("extension", xregexp("\\.(?<extension> mp4|mkv|avi)", "i"));
scene.rule("quality",   xregexp("720p|1080p|1080i", "i"));
scene.rule("source",    xregexp("HDTV|webrip|bluray|web-dl", "i"));
scene.rule("encoder",   xregexp("x264|xvid|H.264|AAC2\\.0", "i"));
scene.rule("air-date",  xregexp("(?<year>\\d{4})[. _-]+(<?month>\\d{2})(<?day>\\d{2})", "i"));
scene.rule("season-ep", xregexp("s(?<season>\\d+)e(?<episode>\\d+)", "i"));
scene.rule("season-ep", xregexp("(?<season>\\d+)x(?<episode>\\d+)", "i"));
scene.rule("group",     xregexp("-(<?group>\\w+)", "i"));
scene.rule("seperator", xregexp("[. _-]+", "i"));
scene.rule("title",     xregexp("\\w+", "i"));

module.exports = function(config, done) {
    async.map(
        config.entries,
        function(entry, cb) {
            var title = entry.title.trim();
        
            if(title.search(extract) > -1) {
                title = title.match(extract)[1];
            }
            
            console.log(title);
            
            scene.tokenize(title, function(error, tokens) {
                if(error) {
                    config.log("warn", "Unable to parse " + title);
                }
                
                console.log(tokens);
                
                cb(null, error ? title : tokens);
            });
        },
        function(error, results) {
            if(error) {
                return done(error);
            }
            
            config.parsed = results;
            
            done();
        }
    );
};

