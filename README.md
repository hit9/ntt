ntt
---

Node Tiny Tests module.

Install
-------

    npm install ntt

Example
-------

```js
var unit = require('ntt');

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

ntt is **not a testing tool**, just run `node test.js`.

License
------------
MIT.
Copyright (c) Chao Wang <hit9@icloud.com>
