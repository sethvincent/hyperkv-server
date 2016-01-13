var qs = require('querystring')
var request = require('request')
var duplexify = require('duplexify')

module.exports = function createClient (config) {
  config = config || {}
  var client = {}
  client.host = config.host || 'http://127.0.0.1:3333'

  client.get = function client_get (key, callback) {
    return request({
      url: client.host + '/' + key,
      json: true
    }, callback)
  }

  client.put = function client_put (key, value, callback) {
    return request({
      url: client.host + '/' + key,
      method: 'POST',
      json: true,
      body: value
    }, callback)
  }

  client.list = function client_list (options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = null
    }

    return request({
      url: client.host + '/' + (options ? '?' + qs.stringify(options) : ''),
      json: true
    }, callback)
  }

  client.sync = function client_sync (options) {
    var stream = duplexify()
    var req =  request({
      url: client.host + '/sync',
      method: 'post'
    })
    stream.setWritable(req)
    req.on('response', function (res) {
      if (!/2\d\d/.test(res.statusCode)) return stream.destroy(error(res))
      stream.setReadable(res)
    })
    return req
  }

  return client
}
