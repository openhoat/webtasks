const _ = require('lodash')
const easyWt = require('easy-wt')
const RedisCli = require('../services/redis')

const mw = (req, res) => {
  const ctx = _.get(req, 'webtaskContext')
  const config = ({
    redis: {
      host: _.get(ctx, 'params.REDIS_HOST') || 'localhost',
      port: _.get(ctx, 'params.REDIS_PORT') || 6379,
      password: _.get(ctx, 'secrets.REDIS_PASSWORD'),
      keys: {
        count: 'count'
      }
    },
    init() {
      this.redis = _.chain(this.redis).omit(_.isUndefined).omit(_.isNull).value()
      return this
    }
  }).init()
  const redisCli = RedisCli(config.redis)
  const op = _.get(req, 'body.op')
  const key = _.get(req, 'body.key')
  const value = _.get(req, 'body.value')
  const args = []
  if (key) {
    args.push(key)
    if (value) {
      args.push(value)
    }
  }
  return redisCli.exec(op, ...args)
    .then(data => {
      res.json({data})
    })
    .catch(err => {
      res.status(400)
      res.json({message: err.message})
    })
}

mw.method = 'post'

mw.params = [
  {name: 'REDIS_HOST', envRef: 'REDIS_LABS_HOST'},
  {name: 'REDIS_PORT', envRef: 'REDIS_LABS_PORT'}
]

mw.secrets = [
  {name: 'REDIS_PASSWORD', envRef: 'REDIS_LABS_PASSWORD'},
  {name: 'AUTH0_DOMAIN'},
  {name: 'AUTH0_CLIENT_ID'},
  {name: 'AUTH0_CLIENT_SECRET'}
]

module.exports = easyWt.export(mw)
