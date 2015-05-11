var mut = require('./mut');
var fs = require('fs');

mut('requests', function(test) {
  test('set', function(t) {
    t.assert.ok(1);
    for (var i = 0; i < 1000; i ++)
    fs.stat('mut.js', function() {
      t.done();
    })
  });
  test('get', function(t) {
    t.assert.ok(0);
  });
  test('get', function(t) {
    t.assert.ok(0);
  });
});
