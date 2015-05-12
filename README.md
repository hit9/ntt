mut
---

Mini unittests module for nodejs/iojs.

Install
-------

    npm install mut

Example
-------

```js
var unit = require('mut');

unit('unit', function(test) {
  test('case1', function(done) {
    // your tests
    done();
  });
  test('case2', function(done) {
    // async tests
    setTimeout(function() {
      done();
    }, 1000)
  });
});
```

License
------------
MIT.
Copyright (c) Chao Wang <hit9@icloud.com>
