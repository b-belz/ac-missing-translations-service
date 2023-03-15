const _ = require('lodash')
const moment = require('moment')

const pjson = require('./../../package.json')

const BootstrapController = {

  find: function(req, res) {
    if (req.hostname === 'admiralcloud.com') {
      res.redirect('https://www.admiralcloud.com')
    }
    const response = {
      version: pjson.version,
      serverTime: moment().format('DD.MM.YYYY HH:mm:ss'),
    }
    if (acapi.config.environment !== 'production') {
      _.set(response, 'branch', _.get(acapi.config, 'branch'))
    }

    return res.json(response)
  },

  routes: [
    { method: 'get', path: '/', action: 'find', policies: [true] },
  ]

}
module.exports = BootstrapController
