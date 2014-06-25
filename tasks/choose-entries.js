"use strict";

var compare = require("../lib/comparisons");

module.exports = function(config) {
    var show;

    for(show in config.entries) {
        config.entries[show].sort(function(a, b) {
            var value = 0;
             
            value += compare.quality(a, b);
            value += compare.proper(a, b);

            return value;
        });

        config.entries[show] = config.entries[show][0];
    }
};
