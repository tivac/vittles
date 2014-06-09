/*jshint node:true */

"use strict";

var FuzzySet = require("fuzzyset.js");

module.exports = function(config) {
    var fuzzyset = new FuzzySet(
            config.parsed.map(function(item) {
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
        
        config.log("silly", "Matching results: %j", results);
        
        if(results[0][0] < 0.5) {
            return;
        }
        
        title = results[0][1];
        
        shows[title] = config.parsed.filter(function(entry) {
            return entry.title === title;
        });
    });
    
    config.choices = shows;
};
