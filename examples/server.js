var http = require('http')
var memdb = require('memdb')
var router = require('../index')(memdb(), { valueEncoding: 'json' })

var server = http.createServer(function (req, res) {
  console.log(req.method, req.url)
  router.match(req, res)
})

server.listen(3333, function () {
  console.log('started on http://127.0.0.1:3333')
})
