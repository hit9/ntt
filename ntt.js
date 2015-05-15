// Node Tiny Tests module.
//
// Copyright (c) Chao Wang <hit9@icloud.com>
//
// Source: github.com/hit9/ntt.git
//
// Example:
//
//   ntt('unit', function(test) {
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
var util   = require('util');

// exports
module.exports = function(name, fn) {
  units.push([name, fn]);
  units.next();
};
var config = exports.confg = {
  style: true,    // if output with style
  bail: false,    // bail on first failure
};

// internals
var fails = 0;
var tests = [];
var units = [];
var log   = console.log;

function styled(s, name) {
  if (config.style) {
    var code = util.inspect.colors[name][0];
    return util.format('\033[%dm%s\033[0m', code, s);
  }
  return s;
}

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
      }).join('\n    ');
    } else {
      msg = e.toString();
    }
    // logging
    var flag = styled('-', 'red');
    var nam_ = styled(name, 'red');
    var msg_ = styled(msg, 'grey');
    log(' %s %s \n   %s', flag, nam_, msg_);

    fails ++;
    tests.pending = false;
    tests.next();
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

    if (config.bail && fails > 0)
      return;

    var start = new Date();

    tests.pending = true;
    execute(test[0], test[1], function() {
      // on pass
      // logging
      var flag = styled('+', 'green');
      var nam_ = styled(test[0], 'green');
      var span = styled((new Date() - start).toFixed(2) + 'ms',
                         'grey');
      log(' %s %s %s', flag, nam_, span);
      // roll next
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
      log(styled('=> %d fails', fails? 'red' : 'green'), fails);
      process.exit(fails);
    }

    log('# %s', styled(unit[0], 'bold'));
    units.pending = true;
    unit[1](function(name, fn) {
      tests.push([name, fn]);
      process.nextTick(tests.next);
    });
  }
};
