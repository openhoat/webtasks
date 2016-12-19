const chai = require('chai')
const expect = chai.expect
const testHelper = require('./test-helper')
const wtRedis = require('../../webtasks/src/redis')

describe('webtask redis', () => {

  it('should incr count key', () => {
    const req = {
      method: 'POST',
      url: '/',
      body: {
        op: 'incr',
        key: 'count'
      }
    }
    return testHelper.request(req, wtRedis)
      .then(result => {
        expect(result).to.be.ok
        expect(result).to.have.property('data').that.is.a('number')
        expect(result.data).to.be.gt(0)
        return result.data
      })
      .then(lastCount => testHelper.request(req, wtRedis)
        .then(result => {
          expect(result).to.be.ok
          expect(result).to.have.property('data').that.is.a('number')
          expect(result.data).to.equal(lastCount + 1)
        })
      )
  })

})
