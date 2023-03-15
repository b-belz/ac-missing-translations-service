const _ = require('lodash')

module.exports = {

  authenticationInfo: (req) => {
    let auth = {
      'x-admiralcloud-clientid': _.get(req, 'headers.x-admiralcloud-clientid'),
      'x-admiralcloud-device': _.get(req, 'headers.x-admiralcloud-device'),
      'authorization': _.get(req, 'headers.authorization')
    }
    return auth
  }
}