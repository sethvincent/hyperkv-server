# hyperkv-server

A basic API server built with [hyperkv](http://npmjs.org/hyperkv) & [hyperlog](http://npmjs.org/hyperlog).

## Install

```
npm install --save hyperkv-server
```

## Usage

```js
var http = require('http')
var memdb = require('memdb')
var router = require('hyperkv-server')(memdb(), { valueEncoding: 'json' })

var server = http.createServer(function (req, res) {
  router.match(req, res)
})

server.listen(3333, function () {
  console.log('started on http://127.0.0.1:3333')
})
```

## Examples

See more examples in the [examples directory]('examples')

## License
[MIT](LICENSE.md)
