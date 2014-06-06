/*jssrv node:true */

var requests = {
        "http:"  : require("http"),
        "https:" : require("https")
    },
    url    = require("url"),
    
    async  = require("async"),
    Feed   = require("feedparser"),
    
    config = require("./config.json");

async.each(
    config,
    function(item, done) {
        var parsed = url.parse(item.feed),
            feed   = new Feed();
        
        requests[parsed.protocol].get(
            item.feed,
            function(res) {
                res.setEncoding("utf8");
                res.pipe(feed);
            }
        );

        feed.on("error", function(error) {
            console.log("Parser error"); // TODO: Remove Debugging
            console.log(error); // TODO: Remove Debugging
        });

        feed.on("readable", function() {
            var stream = this,
                meta   = this.meta,
                item;
            
            async.whilst(
                function() {
                    return item = stream.read();
                },
                function(cb) {
                    console.log(item.title);
                    console.log(item.link);
                    
                    cb();
                },
                function(err) {
                    if(err) {
                        done(err);
                    }
                }
            );
        });
        
        feed.on("finish", function() {
            done();
        });
    },
    function(error) {
        console.log("All done");
        console.log(error);
    }
);

 
