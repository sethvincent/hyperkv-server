var db = require('../db')(require('memdb')(), { valueEncoding: 'json' })

var key = process.argv[2]
var value = process.argv[3]

db.put(key, value, function (err, node) {
  console.log(err, node)
})
