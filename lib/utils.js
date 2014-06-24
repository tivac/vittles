"use strict";

var parse = require("url").parse;

exports.addAuth = function(url, source) {
    var parts;
    
    // Only supports querystring auth atm
    if(source.auth) {
        parts = parse(url);
        
        url += (parts.search ? "&" : "?") + source.auth;
    }
    
    return url;
};
