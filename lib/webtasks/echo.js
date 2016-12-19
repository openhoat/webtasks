const _ = require('lodash')
const easyWt = require('easy-wt')

const mw = (req, res) => {
  res.json(_.pick(req, [
    'method', 'path', 'protocol', 'url', 'baseUrl', 'originalUrl',
    'headers', 'params', 'query', 'rawHeaders', 'body',
    'cookies', 'route', 'user'
  ]))
}

mw.method = 'all'

module.exports = easyWt.export(mw)
