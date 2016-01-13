var test = require('tape')
var http = require('http')

var db = require('../db')(require('memdb')(), { valueEncoding: 'json' })
var router = require('../index')(require('memdb')(), { valueEncoding: 'json' })
var client = require('../client')()

var server = http.createServer(function (req, res) {
  router.match(req, res)
})

test('setup', function (t) {
  server.listen(3333, function () {
    t.end()
  })
})

test('put, get a key/value with client', function (t) {
  client.put('a', 'such value', function (err, res, node) {
    t.notOk(err)
    t.ok(node)
    client.get('a', function (err, res, node) {
      t.notOk(err)
      t.ok(node)
      t.end()
    })
  })
})

test('list with client', function (t) {
  client.list(function (err, res, list) {
    t.notOk(err)
    t.ok(list)
    t.end()
  })
})

test('sync db with server', function (t) {
  var stream = db.log.replicate({ mode: 'sync' })
  var remoteStream = client.sync()

  remoteStream.pipe(stream).pipe(remoteStream).on('end', function () {
    t.end()
  })
})

test('cleanup', function (t) {
  server.close()
  t.end()
})
