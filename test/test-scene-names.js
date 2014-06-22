var assert = require("assert"),
    parse  = require("../lib/scene-names").parse;

describe("Scene Name Parser", function() {
    describe("Bugs", function() {
        var names = require("./specimens/names");

        Object.keys(names).forEach(function(name) {
            it("should parse \"" + name + "\"", function() {
                var details = parse(name);

                assert.deepEqual(details, names[name]);
            });
        });
    });
});
