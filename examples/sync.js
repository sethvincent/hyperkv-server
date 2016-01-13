var hyperkv = require('hyperkv')
var hyperlog = require('hyperlog')
var sublevel = require('subleveldown')

var db1 = require('memdb')()
var db2 = require('memdb')()

var kv1 = hyperkv({
  log: hyperlog(sublevel(db1, 'log'), { valueEncoding: 'json' }),
  db: sublevel(db1, 'kv', { valueEncoding: 'json' })
})

var kv2 = hyperkv({
  log: hyperlog(sublevel(db2, 'log'), { valueEncoding: 'json' }),
  db: sublevel(db2, 'kv', { valueEncoding: 'json' })
})

kv1.put('food', 'pizza', function (err, node) {
  if (err) return console.log(err)
  var s1 = kv1.log.replicate()
  var s2 = kv2.log.replicate()

  s1.pipe(s2).pipe(s1)

  s1.on('end', function () {
    console.log('replication ended')
    kv2.get('food', function (err, value) {
      console.log(err, value)
    })
  })
})
