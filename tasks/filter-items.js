/*jshint node:true */

"use strict";

var Tokenizer = require("../lib/tokenizer");

module.exports = function(config, done) {
    var t = new Tokenizer(true);
    
    t.rule("test", /a/);
    t.rule("test", /b/);
    
    t.tokenize("bbba", function(error, tokens) {
        console.log(arguments);
        
        done();
    });
};

