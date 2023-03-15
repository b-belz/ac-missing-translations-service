const fs = require('fs')
const path = require('path')
const _ = require('lodash')

let config = {
  root: true,
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  "rules": {
    "space-before-function-paren": ["error", { "anonymous": "never", "named": "never", "asyncArrow": "never" }],
    "no-extra-semi": 0,
    "object-curly-spacing": ["error", "always"],
    "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
    "no-useless-escape": 0,
    "standard/no-callback-literal": 0,
    "new-cap": 0
  },
  'parserOptions': {
    'ecmaVersion': 2022
  },
  globals: {
    config: true,
    helper: true,
    acapi: true,
    expect: true,
    describe: true,
    it: true
  }
};

const Models = fs.readdirSync(path.join(__dirname, 'api/models'))

_.forEach(Models, function(item) {
  if (_.endsWith(item, '.js')) {
    _.set(config.globals, _.replace(item, '.js', ''), true)
  }
})


const servicesPath = path.join(__dirname, 'api/services')
if (fs.existsSync(servicesPath)) {
  const Services = fs.readdirSync(servicesPath)
  
  _.forEach(Services, function(item) {
    if (_.endsWith(item, '.js')) {
      _.set(config.globals, _.replace(item, '.js', ''), true)
    }
  })
}

module.exports = config
