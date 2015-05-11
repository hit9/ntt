var assert = require('assert');
var unit = require('./mut');

unit('example', function(test) {
  test('case1', function(done) {
    // should fail
    assert(1 + 2 == 1);
    done();
  });
  test('case2', function(done) {
    // should pass
    setTimeout(function() {
      assert(1 + 2 == 3);
      done();
    }, 1000);
  });
  test('case3', function(done) {
    // should fail
    process.nextTick(function() {
      assert(1 + 3 == 5);
      done();
    })
  });
});
