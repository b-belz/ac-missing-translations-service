const _ = require('lodash')
const request = require('supertest');

const url = 'http://localhost:8111'
const clientId = '5840ef3c-059b-4cf3-910b-c4d818739bb1'

const auth = {
  agent: {
    clientId,
    headers: {
      'x-admiralcloud-dummy-user': 1,
      'x-admiralcloud-dummy-customer': 147
    }
  },
  agent2: {
    clientId,
    headers: {
      'x-admiralcloud-dummy-user': 2,
      'x-admiralcloud-dummy-customer': 147
    }
  },
  agentExternal: {}
}


const handleExternalRequests = (req, config) => {
  if (_.get(config, 'clientId')) _.set(req, 'header.x-admiralcloud-clientId', _.get(config, 'clientId'))
  if (_.get(config, 'bearer')) req.set('Authorization', 'Bearer ' + _.get(config, 'bearer'))
  if (_.get(config, 'device')) _.set(req, 'header.x-admiralcloud-device', _.get(config, 'device'))
  if (_.get(config, 'headers')) _.merge(req.header, config.headers)
 }


const agent = request.agent(url).use((req) => {
  handleExternalRequests(req, _.get(auth, 'agent'))
})

const agent2 = request.agent(url).use((req) => {
  handleExternalRequests(req, _.get(auth, 'agent2'))
})

const agentExternal = request.agent(url).use((req) => {
  handleExternalRequests(req, _.get(auth, 'agentExternal'))
})

const callAPI = function(params, cb) {
  prepareCommand(params, cb)
}

const callAPI2 = function(params, cb) {
  _.set(params, 'agent', agent2)
  prepareCommand(params, cb)
}


const callExternalAPI = (params, cb) => {
  _.set(params, 'agent', agentExternal)
  prepareCommand(params, cb)
}


const prepareCommand = (params, cb) => {
  const method = _.toLower(_.get(params, 'method', 'get'))
  const path = _.get(params, 'path')
  const data = _.get(params, 'data', {})
  const queryParams = _.get(params, 'queryParams', {})
  const expectedStatus = _.get(params, 'expectedStatus', 200)
  const expectedContentType = _.get(params, 'expectedContentType', /json/)
  const type = _.get(params, 'type', 'json') // POST type

  const call = _.get(params, 'agent', agent)

  const headers = {
    'X-AdmiralCloud-Test': _.get(params, 'testMode', false) // if true X-AdmiralCloud-Test is sent as true
  }
  if (_.get(params, 'headers')) {
    _.merge(headers, _.get(params, 'headers'))
  }
  if (_.get(params, 'etag')) {
    _.set(headers, 'x-admiralcloud-checksum', _.get(params, 'etag'))
  }

  let apiCall 
  if (method === 'get') {
    apiCall = call.get(path)
  }
  else if (method === 'post') {
    apiCall = call.post(path).type(type)
  }
  else if (method === 'put') {
    apiCall = call.put(path)
  }
  else if (method === 'delete' || method === 'destroy') {
    apiCall = call.del(path)
  }
  else {
    console.log('METHOD %s is not defined', method)
  }

  if (queryParams) apiCall.query(queryParams)
  if (data) apiCall.send(data)

  if (_.get(params, 'timeout')) {
    console.log('APICALL Timeout set to %sms', _.get(params, 'timeout'))
    apiCall.timeout({
      response: _.get(params, 'timeout')
    })
  }

  apiCall.set(headers)
    .on('error', (err) => {
      //console.log(13, _.get(that, 'config.expectedStatus'),  _.get(err, 'status'))
      if (expectedStatus !== _.get(err, 'status')) {
        console.error(_.get(err, 'response.body'))
      }
    })
    .end((err, res) => {
      if (err) {
        console.log(new Date().toJSON())
        console.log('Failed %j', err)
        console.log(_.get(res, 'body') || _.get(res, 'text') || _.get(res, 'headers'))
      }
      if (_.get(params, 'debug')) {
        console.log(new Date().toJSON())
        console.log(_.get(res, 'body') || _.get(res, 'text') || _.get(res, 'headers'))
      }
      return cb(err, res)
    })
  if (expectedStatus) {
    apiCall.expect(expectedStatus)
  }
  if (expectedStatus < 300 || expectedStatus >= 400 && expectedContentType) {
    apiCall.expect('Content-Type', expectedContentType)
  }

}


module.exports = {
  url,
  clientId,
  request,
  callAPI,
  callAPI2,
  callExternalAPI
};
