/*jshint node:true */

"use strict";

var scene     = require("../lib/scene-names"),
    extract   = /^File: (.*) Thread:/;

module.exports = function(config) {
    config.parsed = config.entries
        .map(function(entry) {
            var title = entry.title.trim(),
                details;
        
            if(title.search(extract) > -1) {
                title = title.match(extract)[1];
            }
            
            details = scene.parse(title);
            
            if(details instanceof Error) {
                return;
            }
            
            config.log("silly", details);
            
            details.source = entry;
            
            return details;
        })
        .filter(function(entry) {
            return entry;
        });
};

