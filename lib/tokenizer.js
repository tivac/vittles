/*jshint node:true */

"use strict";

var xregexp     = require("xregexp").XRegExp,
    digitsRegex = /\d+/,
    Tokenizer;

Tokenizer = function() {
    this.rules = [];
};

Tokenizer.prototype = {
    rule : function(name, regex, options) {
        this.rules.push({
            name    : name,
            regex   : regex,
            options : options || {}
        });
    },
    
    tokenize : function(source, done) {
        var tokens = [],
            text   = "" + source,
            found, error;
        
        while(text.length > 0) {
            found = this.rules.some(function(rule) {
                var matches, token;
                
                // No matches or didn't match the start of the text
                if(!xregexp.test(text, rule.regex, 0, true)) {
                    return;
                }
                
                matches = xregexp.exec(text, rule.regex);
                
                token = {
                    rule  : rule.name,
                    token : matches[0]
                };
                
                // Support XRegExp named captures by pushing multiple tokens onto the array
                Object.keys(matches).forEach(function(key) {
                    if(key === "index" ||
                       key === "input" ||
                       digitsRegex.test(key)) {
                        return;
                    }
                    
                    token[key] = matches[key];
                });
                
                if(!rule.options.swallow) {
                    tokens.push(token);
                }
                
                text = text.substring(matches[0].length);
                
                return text;
            });
            
            if(!found && text.length !== 0) {
                error = "Couldn't find any tokens in \"" + text + "\"";
                break;
            }
        }
        
        done(error, tokens);
    }
};

module.exports = Tokenizer;
