"use strict";

module.exports = function(config) {
    var show;

    for(show in config.entries) {
        config.entries[show] = config.entries[show].filter(function(entry) {
            // TODO: smarter filtering
            // (support propers/removing dupes at the very least)
            if(!entry.quality) {
                return false;
            }

            return true;
        });
    }
};
