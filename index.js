var qs = require('querystring')
var JSONStream = require('JSONStream')
var response = require('response')
var router = require('match-routes')()
var body = require('body/json')
var createDatabase = require('./db')

module.exports = function (levelup, options) {
  var db = createDatabase(levelup, options)

  router.on('/', function (req, res, url) {
    if (req.method === 'GET') {
      var query = qs.parse(url.query)
      db.createReadStream(query).pipe(JSONStream.stringify()).pipe(res)
    }
  })

  router.on('/:key', function (req, res, url) {
    if (req.method === 'POST') {
      body(req, res, function (err, body) {
        if (err) return response.json(err).status(500).pipe(res)
        db.put(url.params.key, body, function (err, node) {
          if (err) return response.json(err).status(500).pipe(res)
          response.json(node).pipe(res)
        })
      })
    } else if (req.method === 'GET') {
      db.get(url.params.key, function (err, node) {
        if (err) return response.json(err).status(500).pipe(res)
        response.json(node).pipe(res)
      })
    }
  })

  router.on('/sync', function (req, res, url) {
    if (req.method === 'POST') {
      var stream = db.log.replicate({ mode: 'sync' })
      req.pipe(stream).pipe(res)
      stream.on('end', function () {
        res.end()
      })
    }
  })

  return router
}
