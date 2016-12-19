const Promise = require('bluebird')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const easyWt = require('easy-wt')

Promise.promisifyAll(jwt)

const mw = (req, res) => {
  const ctx = _.get(req, 'webtaskContext')
  const secret = _.get(ctx, 'secrets.JWT_SECRET') || '7bJbNCGuRjV2R8vlGTrUwfRZ'
  if (req.method === 'GET') {
    return jwt.verifyAsync(req.query.token, secret)
      .then(decoded => {
        res.json(decoded)
      })
  } else if (req.method === 'POST') {
    const opt = (opt => opt && JSON.parse(opt))(_.get(ctx, 'secrets.JWT_OPT'))
    return jwt.signAsync({foo: 'bar'}, secret, opt)
      .then(token => {
        res.json({token})
      })
  } else {
    res.status(405).end()
  }
}


mw.method = 'all'

mw.secrets = [
  {name: 'JWT_SECRET'}
]

module.exports = easyWt.export(mw)
