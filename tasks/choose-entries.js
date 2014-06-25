"use strict";

var _ = require("lodash"),
    
    compare = require("../lib/comparisons");

module.exports = function(config) {
    config.entries = _.map(config.entries, function(entries) {
        entries
            .sort(function(a, b) {
                var value = 0;
                 
                value += compare.quality(a, b);
                value += compare.proper(a, b);
                value += compare.season(a, b);
                value += compare.episode(a, b);

                return value;
            });
        
        // Since better quality duplicate episodes are sorted earlier
        // we can now safely unique the array
        return _.unique(
            entries,
            true,
            function(entry) {
                return "" + entry.season + entry.episode;
            }
        );
    });
};
