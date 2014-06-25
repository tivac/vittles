"use strict";

var _quality = [ "", "480p", "720p", "1080i", "1080p" ],
    _simple, _clamp;
    
_simple = function(a, b) {
    if(!a && !b || a === b) {
        return 0;
    }
    
    if(a && !b) {
        return -1;
    }
    
    if(!a && b) {
        return 1;
    }
};

_clamp = function(value) {
    return Math.max(-1, Math.min(1, value));
};

exports.quality = function(a, b) {
    return _clamp(_quality.indexOf(b.quality) - _quality.indexOf(a.quality));
};

exports.proper = function(a, b) {
    return _simple(a.proper, b.proper);
};

exports.season = function(a, b) {
    var simple = _simple(a.season, b.season);

    return typeof simple !== "undefined" ? simple : _clamp(b.season - a.season);
};

exports.episode = function(a, b) {
    var simple = _simple(a.episode, b.episode);

    return typeof simple !== "undefined" ? simple : _clamp(b.episode - a.episode);
};
