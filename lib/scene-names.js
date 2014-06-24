"use strict";

var scene = require("./scene-tokenizer"),
    _title;

_title = function(tokens) {
    var title = [];
    
    // Title is usually all sequential "title" tokens at the beginning
    tokens.some(function(token) {
        if(token.rule !== "title") {
            return true;
        }
        
        title.push(token.token);
    });
    
    title = title.join(" ").trim();
    
    // Support shows that get caught by the episode filter (like 24)
    if(!title) {
        tokens.some(function(token) {
            if(token.rule !== "episode") {
                return;
            }
            
            title = token.episode;
            
            return title;
        });
    }
    
    return title;
};

exports.parse = function(title) {
    var tokens = scene.tokenize(title),
        details = {};
    
    if(tokens instanceof Error) {
        return tokens;
    }
    
    details.title = _title(tokens);
    
    tokens.forEach(function(token) {
        switch(token.rule) {
            case "episode" :
                details.season  = 1;
                details.episode = parseInt(token.episode, 10);
                break;
            
            case "season-ep" :
                details.season  = parseInt(token.season, 10);
                details.episode = parseInt(token.episode, 10);
                break;

            case "quality" :
                details.quality = token.quality || token.token;
                break;

            case "proper" :
                details.proper = true;
                break;

            case "air-date" :
                details.airdate = {
                    year  : parseInt(token.year, 10),
                    month : parseInt(token.month, 10),
                    day   : parseInt(token.day, 10)
                };
                break;
        }
    });
    
    return details;
};
