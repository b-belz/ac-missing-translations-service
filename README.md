# AC UserTasks Service

This service is responsible for the ac-client user notifications.

# Installation

- clone this repository
- install node modules with `yarn`

## Configuration file
This services uses AWS IAM roles instead of AWS IAM users, so no specific credentials are required. Use a role instead. See here for details: https://admiralcloud.atlassian.net/l/cp/YzLxnmpB

Create a environment configuration file (e.g. *development.js*) under `config/env` and put local settings derived from config files in here if necessary:
```javascript

module.exports = {}
```

# Start service

```
pm2 start start.json
```

or
```
node server.js
```

# Testing
## Configuration file
Create a test environment configuration file `test.js` under `config/env` with the following settings:
```javascript
module.exports = {
    aws,
    localRedis: {
        port: 6386,
    },
    localDatabase: {
        port: 3386,
    },
}
```

## Start tests

Run tests with `make apptest`