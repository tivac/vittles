/*jshint node:true */

"use strict";

var xregexp = require("xregexp").XRegExp,
    Tokenizer;

Tokenizer = function() {
    this.rules = [];
};

Tokenizer.prototype = {
    rule : function(name, regex) {
        this.rules.push({
            name  : name,
            regex : Object.prototype.toString.call(regex) === "[object RegExp]" ? regex : new RegExp(regex, "i")
        });
    },
    
    tokenize : function(source, done) {
        var tokens = [],
            text   = "" + source,
            found, error;
        
        while(text.length > 0) {
            found = this.rules.some(function(rule) {
                var match = xregexp.test(text, rule.regex, 0, true),
                    result,
                    token;
                
                // No matches or didn't match the start of the text
                if(!match) {
                    return;
                }
                
                result = xregexp.exec(text, rule.regex);
                
                // Support XRegExp named captures by returning an object instead of a string
                if(rule.regex.xregexp && rule.regex.xregexp.captureNames && rule.regex.xregexp.captureNames.length) {
                    token = {};
                    
                    rule.regex.xregexp.captureNames.forEach(function(name) {
                        token[name] = result[name];
                    });
                }
                
                tokens.push({
                    rule : rule.name,
                    token : token || result[0]
                });
                
                text = text.substring(result[0].length);
                
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
