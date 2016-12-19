const easyWt = require('easy-wt')

const mw = (req, res) => {
  res.json({foo: 'bar'})
}

mw.method = 'get'

module.exports = easyWt.export(mw)
