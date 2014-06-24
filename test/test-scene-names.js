"use strict";

var assert = require("assert"),
    parse  = require("../lib/scene-names").parse;

describe("Scene Name Parser", function() {
    var names = require("./specimens/names");

    Object.keys(names).forEach(function(name) {
        it("should parse \"" + name + "\" correctly", function() {
            debugger;
            var details = parse(name);

            assert.deepEqual(details, names[name].details);
        });
    });
});
