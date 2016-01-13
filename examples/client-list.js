var client = require('../client')()

client.list({ live: true }).on('data', function (data) {
  console.log(JSON.parse(data.toString()))
})
