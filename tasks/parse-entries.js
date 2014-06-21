"use strict";

var scene     = require("../lib/scene-names"),
    extract   = /^File: (.*) Thread:/;

module.exports = function(config) {
    config.entries = config.entries
        .map(function(entry) {
            var title = entry.title.trim(),
                details;
            
            if(title.search(extract) > -1) {
                title = title.match(extract)[1];
            }
            
            config.log("silly", "Attempting to parse '%s'", title);
            
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

