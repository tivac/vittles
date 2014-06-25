"use strict";

var _quality = [ "", "480p", "720p", "1080i", "1080p" ],
    _simple;

exports.quality = function(a, b) {
    var left  = a.quality ? _quality.indexOf(a.quality) : 0,
        right = b.quality ? _quality.indexOf(b.quality) : 0;

    return left - right;
};

exports.proper = function(a, b) {
    var left  = a.proper ? 1 : 0,
        right = b.proper ? 1 : 0;

    return left - right;
};

exports.season = function(a, b) {
    var left  = a.season ? a.season : 0,
        right = b.season ? b.season : 0;

    return left - right;
};

exports.episode = function(a, b) {
    var left  = a.episode ? a.episode : 0,
        right = b.episode ? b.episode : 0;

    return left - right;
};
