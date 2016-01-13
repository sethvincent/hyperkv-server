var hyperkv = require('hyperkv')
var hyperlog = require('hyperlog')
var sublevel = require('subleveldown')

var level = require('level')
var client = require('../client')()

var db = require('memdb')()

var kv = hyperkv({
  log: hyperlog(sublevel(db, 'log'), { valueEncoding: 'json' }),
  db: sublevel(db, 'kv', { valueEncoding: 'json' })
})

var stream = kv.log.replicate({ mode: 'sync' })
var remoteStream = client.sync()

remoteStream.pipe(stream).pipe(remoteStream).on('end', function () {
  kv.createReadStream().on('data', console.log)
})
