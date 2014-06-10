/*jssrv node:true */

"use strict";

var url   = require("url"),
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
            var parsed = url.parse(item),
                feed   = new Feed();
            
            feed.on("error", function(error) {
                config.log("error", error + " (" + item + ")");
            });
            
            feed.on("end", cb);
            
            feed.on("readable", function() {
                var entry;
                
                while(entry = this.read()) {
                    config.entries.push(entry);
                }
            });
            
            config.log("info", "Requesting %s", item);
            
            requests[parsed.protocol].get(
                item,
                function(res) {
                    res.setEncoding("utf8");
                    
                    config.log("verbose", "Parsing %s", item);
                    
                    res.pipe(feed);
                }
            );
        },
        done
    );
};
