/*jshint node:true */

"use strict";

var FuzzySet = require("fuzzyset.js");

module.exports = function(config) {
    var fuzzyset = new FuzzySet(
            config.entries.map(function(item) {
                return item.title;
            })
        ),
        shows = {};
    
    config.shows.forEach(function(show) {
        var results = fuzzyset.get(show),
            title;
        
        if(!results) {
            config.log("warn", "Couldn't find a match for " + show);
            
            return;
        }
        
        results.sort(function(a, b) {
            return a[0] > b[0];
        });
        
        config.log("silly", "Results for '%s': %j", show, results);
        
        if(results[0][0] < 0.5) {
            return;
        }
        
        title = results[0][1];
        
        config.log("info", "Found entries matching '%s'", title);
        
        shows[title] = config.entries.filter(function(entry) {
            return entry.title === title;
        });
    });
    
    // TODO: remove any duplicate shows
    
    config.entries = shows;
};
