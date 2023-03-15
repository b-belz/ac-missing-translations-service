module.exports.database = {
    servers: [
     { server: 'missingTranslation', host: 'localhost',  port: 3306, database: 'development', user: 'actest', password: 'actest', ssl: false }
    ],
    debugQueries: {
      enabled: false,
      logQuery: false,
      measureTime: false,
      measureTimeThreshold: 60
    }
  }