"use strict";

var fs     = require("fs"),
    path   = require("path"),
    
    async  = require("async"),
    needle = require("needle"),
    
    _utils = require("../lib/utils");

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
                url  : _utils.addAuth(details.source.link, details.source.feed),
                name : title + ".torrent"
            });
        });
    }

    async.each(
        files,
        function(file, next) {
            var dest = path.join("./", file.name),
                out  = fs.createWriteStream(dest);
            
            out.on("error",  next);
            out.on("finish", next);
            
            config.log("info", "Downloading %s to \"%s\"", file.url, dest);
            
            needle.get(file.url).pipe(out);
        },
        function(errors) {
            done(errors);
        }
    );
};
