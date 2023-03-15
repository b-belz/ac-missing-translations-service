const axios = require('axios')
const _ = require('lodash')

module.exports = {

  callIAM: async({ endpoint, data, auth }) => {
    /// NOTE: In the future we might want to use a more elaborate mock IAM server
    if (acapi.config.environment === 'test') {
      return {
        status: 200,
        data: {
          body: [
            { id: 1, customerId: 147 },
            { id: 2, customerId: 147 }
          ]
        },
        statusText: 'OK'
      }
    }

    const endpoints = {
      'user.find': '/v2/user',
    }

    const url = _.get(acapi, 'config.localIAM.url', acapi.config.apiHosts.iam[acapi.config.environment]) + endpoints[endpoint]
    const axiosParams = {
      url,
      headers: auth,
      data
    }
    return await axios(axiosParams)


  }

}