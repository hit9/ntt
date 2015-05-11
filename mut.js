// Mini unittests module for nodejs/iojs.
// Copyright (c) Chao Wang <hit9@icloud.com>
//
// Source: github.com/hit9/mut.git
//
// Example:
//
//   mut('request', function(test) {
//     test('get', function(t) {});
//     test('post', function(t) {});
//   });
//
// License: MIT.

var assert = require('assert');
var util   = require('util');


var tests = [];

tests.put = function(name, fn) {
  tests.push([name, fn]);
};

tests.next = function() {
  var test = tests.shift();
  if (!test)
    return;

  var name = test[0];
  var fn = test[1];

  try {
    var startAt = new Date();
    fn(t);
    var endAt = new Date();
    console.log('   ✓ %s %sms', name,
                (endAt - startAt).toFixed(2));
  } catch(e) {
    console.log('   ✖ %s ', name);
    if (e.stack) {
      var lines = e.stack.split('\n').slice(0, 2);
      console.log('     %s', lines[0]);
      console.log('     %s', lines[1]);
    }
  } finally {
    tests.next();
  }
};


var t = {};

t.log = console.log;
t.done = tests.next;
t.assert = assert;

var units = [];

units.put = function(name, fn) {
  units.push([name, fn]);
};

units.next = function() {
  var unit = units.shift();
  if (!unit)
    return;

  console.log('=> %s', unit[0]);
  unit[1](function(name, fn) {
    tests.put(name, fn);
    tests.next();
  });
  units.next();
};

module.exports = function(name, fn) {
  units.put(name, fn);
  units.next();
};
