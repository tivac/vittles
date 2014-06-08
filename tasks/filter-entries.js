/*jshint node:true */

"use strict";

var async    = require("async"),
    FuzzySet = require("fuzzyset.js");

module.exports = function(config, done) {
    var fuzzyset = new FuzzySet(
            config.parsed.map(function(item) {
                return item.title;
            })
        );
    
    async.each(
        config.shows,
        function(show, cb) {
            var results = fuzzyset.get(show),
                title, entries;
        
            if(!results) {
                config.log("warn", "Couldn't find a match for " + show);
                
                return cb();
            }
            
            results.sort(function(a, b) {
                return a[0] > b[0];
            });
            
            title = results[0][1];
            
            entries = config.parsed.filter(function(entry) {
                return entry.title === title;
            });
            
            console.log(entries);
        },
        done
    );
};
