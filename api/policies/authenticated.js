const policy = require('ac-api-policies/default.light.js')
const _ = require('lodash')

module.exports = async(req, res, next) => {
  if (acapi.config.environment === 'test') {
    const userId = _.get(req.headers, 'x-admiralcloud-dummy-user')
    const customerId = _.get(req.headers, 'x-admiralcloud-dummy-customer')
    if (userId && customerId) {
      _.set(req, 'user', { id: _.parseInt(userId), customerId: _.parseInt(customerId) })
      _.set(req, 'customer.id', customerId)
      return next()
    }
    acapi.log.error('Policy.authenticated | user_not_found | TEST DUMMY USER NOT FOUND')
    return res.miscError({ statusCode: 403, message: 'forbiddenAuth' })
  }

// we only need to know, that the user is authenticated and provide user id and customerId
  // for now we request that at auth server 
  try {
    await policy(req, res, { acapi })
    next()
  }
  catch(e) {
    let level = 'warn'
    if (typeof e?.code === 'string' && e.code.startsWith('ECON')) {
      // log as real error
      level = 'error'
    }
    let error = { statusCode: 401, message: 'invalidSession' }
    if (e.statusCode === 429) {
      error = {
        statusCode: e.statusCode,
        message: e.message
      }
    } 
    acapi.log[level]('Policy.authenticated | session problem | %s', e?.message)
    return res.miscError(error)
  }
}