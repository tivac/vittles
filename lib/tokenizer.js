/*jshint node:true */

"use strict";

var Tokenizer;

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
        
        while(text.length) {
            found = this.rules.some(function(rule) {
                var result = rule.regex.exec(text);
                
                // No matches or didn't match the start of the text
                if(!result || result.index !== 0) {
                    return;
                }
                
                tokens.push(result[0]);
                
                text = text.substring(result[0].length);
                
                return text;
            });
            
            if(!found) {
                error = "Couldn't find any tokens in \"" + text + "\"";
                break;
            }
        }
        
        done(error, tokens);
    }
};

module.exports = Tokenizer;
