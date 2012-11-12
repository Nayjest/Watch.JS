"use strict";
var WatchJS = require('../lib/watch.min.js');
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['tests'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'isArray': function(test) {
    test.expect(2);
    // tests here
    test.equal(WatchJS.isArray([]), true, 'Checking "isArray"');
    test.equal(WatchJS.isArray({}), false, 'Checking "isArray"');
    test.done();
  }
};
