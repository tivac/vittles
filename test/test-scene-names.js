var assert = require("assert"),
    parse  = require("../lib/scene-names").parse;

describe("Scene Name Parser", function() {
    describe("Bugs", function() {
        require("./broken").forEach(function(entry) {
            it("should parse \"" + entry.source + "\"", function() {
                var details = parse(entry.source);

                assert.deepEqual(details, entry.details);
            });
        });
    });
});
