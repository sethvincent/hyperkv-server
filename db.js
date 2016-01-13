var hyperkv = require('hyperkv')
var hyperlog = require('hyperlog')
var sublevel = require('subleveldown')

module.exports = function (db, options) {
  return hyperkv({
    log: hyperlog(sublevel(db, 'log'), options),
    db: sublevel(db, 'kv', options)
  })
}
