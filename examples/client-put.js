var client = require('../client')()

var key = process.argv[2]
var value = process.argv[3]

client.put(key, value, function (err, response, node) {
  if (err) return console.log(err)
  console.log('putted', node)
})
