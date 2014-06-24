"use strict";

module.exports = {
    dirs : [
        "./tasks"
    ],
    
    steps : {
        default : [
            "feeds",
            "parse-entries",
            "filter-entries",
            "choose-entries",
            "download-entries"
        ]
    },
    
    feeds : [
        "http://www.trackera.com/?page=rss",
        {
            url     : "http://www.trackerb.com/?page=rss",
            extract : /^File: (.*) Thread:/,
            auth    : "sessu=113%26a4ed8d53a396b33cf5cafb1b0acdf3bd"
        }
    ],
    
    shows : [
        "Orange is the New Black",
        "Cosmos",
        "Game of Thrones",
        "So You Think You Can Dance",
        "24"
    ]
};
