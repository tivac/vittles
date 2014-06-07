/*jshint node:true */

"use strict";

var Tokenizer = require("../lib/tokenizer");

module.exports = function(config, done) {
    var t = new Tokenizer(true);
    
    t.rule("a", /a/);
    t.rule("b", /b/);
    
    t.tokenize("bbba", function(error, tokens) {
        console.log(arguments);
        
        done();
    });
};

