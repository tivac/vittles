/*jssrv node:true */

"use strict";

var async  = require("async"),
    needle = require("needle"),
    Feed   = require("feedparser"),
    
    _utils = require("../lib/utils");
    
module.exports = function(config, done) {
    config.entries = [];
    
    async.each(
        config.feeds,
        function(item, next) {
            var feed  = new Feed(),
                url;
            
            url = _utils.addAuth(item.url || item, item);
            
            feed.on("error", function(error) {
                config.log("error", error + " (" + url + ")");
            });
            
            feed.on("end", next);
            
            feed.on("readable", function() {
                var entry;
                
                while(entry = this.read()) {
                    entry.feed = item;

                    config.entries.push(entry);
                }
            });
            
            config.log("info", "Requesting %s", url);
            
            needle.get(url).pipe(feed);
        },
        done
    );
};
