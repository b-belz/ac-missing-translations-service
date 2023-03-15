/**
 * This is the actual test file which calls all detailed test (which are in the tests subdirectory and are required by this file)
 *
 * Test works as follows:
 * - a first basic customer is created.
 * - User logs in, creates a new user
 *
 *
 *  Frameworks
 *  + http://unitjs.com/guide/should-js.html
 *
 *
 **/

const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2))

const { expect, should } = require('chai')
global.expect = expect
global.should = should()

global.config = require('./config')
global.helper = require('./tests/helper')

const mode = (_.isInteger(_.get(argv, 'mode')) && _.get(argv, 'mode')) || 0

// make token globally available
global.token = false;

// make embedlink fake API response available
_.set(global, 'customerId', 147)
_.set(global, 'countEmbeds', 0)
_.set(global, 'countPlays', 0)
_.set(global, 'userId', 'MTIz') // '123' base64 encoded
_.set(global, 'timeLag', 90) // must be higher that app.config.allowedLogTimeLag (currently 60s)

const suite = {
  1: require('./suites/default')
}

if (mode === 2) {
  _.set(suite, 2, require('./suites/localTest'))
}


// check http status code
global.checkStatusCode = false; // set to false to make debugging easier

// fetcch redis config from config/env localRedis
const envTest = require('../config/env/test')
_.set(global, 'redisPort', _.get(envTest, 'localRedis.port', 6379))

// NOW THe TESTS

if (mode === 2) suite[2].testsuite()
else suite[1].testsuite()