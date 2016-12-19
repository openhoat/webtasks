const Promise = require('bluebird')
const _ = require('lodash')
const redis = require('redis')

Promise.promisifyAll(redis.RedisClient.prototype)

class RedisCli {

  constructor(config) {
    this.config = Object.assign(
      {},
      _.chain(config).pick(['host', 'port', 'password']).omit(_.isUndefined).omit(_.isNull).value()
    )
  }

  exec(op, ...args) {
    return Promise.resolve()
      .then(() => {
        if (!op) {
          throw new Error('missing op!')
        }
        const cli = redis.createClient(this.config.port, this.config.host, {no_ready_check: true})
        if (typeof cli[`${op}Async`] !== 'function') {
          throw new Error(`unsupported op : ${op}`)
        }
        return Promise.resolve()
          .then(() => this.config.password && cli.authAsync(this.config.password))
          .then(() => cli[`${op}Async`](...args))
          .finally(() => cli.quitAsync())
      })
  }

}

function RedisCliFactory(...args) {
  return new RedisCli(...args)
}

module.exports = RedisCliFactory
