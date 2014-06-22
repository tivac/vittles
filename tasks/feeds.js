/*jssrv node:true */

"use strict";

var parse = require("url").parse,
    async = require("async"),
    Feed  = require("feedparser"),

    requests = {
        "http:"  : require("http"),
        "https:" : require("https")
    };
    
module.exports = function(config, done) {
    config.entries = [];
    
    async.each(
        config.feeds,
        function(item, cb) {
            var url    = item.url || item,
                parsed = parse(url),
                feed   = new Feed();
            
            feed.on("error", function(error) {
                config.log("error", error + " (" + url + ")");
            });
            
            feed.on("end", cb);
            
            feed.on("readable", function() {
                var entry;
                
                while(entry = this.read()) {
                    entry.feed = item;

                    config.entries.push(entry);
                }
            });
            
            config.log("info", "Requesting %s", url);
            
            requests[parsed.protocol].get(
                url,
                function(res) {
                    res.setEncoding("utf8");
                    
                    config.log("verbose", "Parsing %s", url);
                    
                    res.pipe(feed);
                }
            );
        },
        done
    );
};
