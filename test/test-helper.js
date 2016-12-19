const Promise = require('bluebird')
const httpMocks = require('node-mocks-http')
const events = require('events')

const testHelper = {
  request: (reqOpt, middleware, ctx) => new Promise((resolve, reject) => {
    const req = httpMocks.createRequest(Object.assign({}, reqOpt, ctx && {webtaskContext: ctx}))
    const res = httpMocks.createResponse({eventEmitter: events.EventEmitter})
    res.on('end', () => {
      resolve(JSON.parse(res._getData()))
    })
    try {
      middleware(req, res, reject)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = testHelper
