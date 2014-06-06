/*jssrv node:true */

var http = require("http"),
    Feed = require("feedparser"),
    feed = new Feed();

http.get(
    "http://www.vcdq.com/browse/rss/1/0/3_2/10_9_21_22_23_24_6_28_32_19_11_3_2/0/2011_2012_2013/0",
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

    while(item = stream.read()) {
        console.log(item);
    }
});
 
