// Mini unittests module for nodejs/iojs.
// Copyright (c) Chao Wang <hit9@icloud.com>
//
// Source: github.com/hit9/mut.git
//
// Example:
//
//   mut('unit', function(test) {
//     test('case1', function(done) {
//       done();
//     });
//     test('case2', function(done) {
//       setTimeout(function() {
//         done();
//       }, 1000)
//     });
//   });
//
// License: MIT.

var domain = require('domain');

var fails = 0;
var tests = [];
var units = [];

var log = console.log;


function execute(name, fn, cb) {
  var d = domain.create();
  d.on('error', function(e) {
    // on fail
    var msg;
    if (e.stack) {
      msg = e.stack.trim()
      .split(/\n/)
      .slice(0, 2)
      .map(function(s) {
        return s.trim();
      }).join(', ');
    } else {
      msg = e.toString();
    }
    log(' - %s\n\t%s', name, msg);
    fails ++;
    tests.pending = false;
  });
  d.run(function() {
    return fn(cb);
  });
}

tests.pending = false;
tests.next = function() {
  if (!tests.pending) {
    var test = tests.shift();
    if (!test) {
      units.pending = false;
      units.next();
      return;
    }

    tests.pending = true;
    execute(test[0], test[1], function() {
      // on pass
      log(' + %s', test[0]);
      tests.pending = false;
      tests.next();
    });
  }
};

units.pending = false;
units.next = function() {
  if (!units.pending) {
    var unit = units.shift();
    if (!unit) {
      log('\n=> %d fails', fails);
      process.exit(fails);
    }

    log('# %s', unit[0]);
    units.pending = true;
    unit[1](function(name, fn) {
      tests.push([name, fn]);
      process.nextTick(tests.next);
    });
  }
};

module.exports = function(name, fn) {
  units.push([name, fn]);
  units.next();
};
