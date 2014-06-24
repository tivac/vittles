"use strict";

var assert = require("assert"),
    scene  = require("../lib/scene-tokenizer");

describe("Scene Name Tokenizer", function() {
    var names = require("./specimens/names");

    Object.keys(names).forEach(function(name) {
        it("should tokenize \"" + name + "\" correctly", function() {
            var details = scene.tokenize(name);
            
            assert.deepEqual(details, names[name].tokens);
        });
    });
});
