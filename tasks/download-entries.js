"use strict";

var async = require("async");

module.exports = function downloadEntries(config, done) {
    var files = [],
        show;

    for(show in config.entries) {
        config.entries[show].forEach(function(details) {
            var title = details.source.title;

            if(details.source.feed.extract) {
                title = title.match(details.source.feed.extract)[1];
            }

            files.push({
                url  : details.source.link,
                name : title + ".torrent"
            });
        });
    }

    async.each(
        files,
        function(file, cb) {
            console.log(file); // TODO: Remove Debugging
            //TODO: download & save
            cb();
        },
        function(errors) {
            done(errors);
        }
    );
};
