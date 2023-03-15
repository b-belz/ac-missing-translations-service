const _ = require('lodash')
const async = require('async')
const redisLock = require('ac-redislock')

const functionName = _.padEnd('Bull', _.get(acapi.config, 'log.padLengthFunctiomName'))

const BullHelper = {

  processUserTasks: () => {
    const jobList = 'createUserTask'
    const { queueName, jobListConfig } = acapi.bull.prepareQueue({ jobList })
    const functionIdentifier = _.padEnd(jobList, _.get(acapi.config, 'log.padLengthFunctionIdentifier'))

    acapi.bull[queueName].process('*', _.get(jobListConfig, 'concurrency', 1), (job, cb) => {
      const jobId = _.get(job, 'data.jobId')
      const items = _.get(job, 'data.tasks')

      const startTime = new Date().getTime()
      const jobResult = {
        processed: [],
        conflict: [],
        error: [],
        ignored: []
      }
      let progress = 0

      async.eachSeries(items, (task, itDone) => {
        progress++
        let percent = progress / _.size(items) * 100
        BullHelper.logProgress(job, percent)

        async.series({
          validateTask: (done) => {
            const requiredValues = { userId: _.isInteger, customerId: _.isInteger, creatorId: _.isInteger, type: _.isString, task: _.isPlainObject }
            for (const key in requiredValues) {
              const value = _.get(task, key)
              const check = _.get(requiredValues, key)
              if (!check(value)) return done({ message: key + '_isWrongType' })
            }
            if (_.has(task, 'task.ids')) {
              if (!_.isArray(task.task.ids)) return done({ message: 'task.task.ids_isWrongType' })
              if (_.size(task.task.ids) === 0) return done({ message: 'task.task.ids_minSize1' })
            }
            return done()
          },
          createTask: (done) => {
            UserTask.create(task).exec((err) => {
              if (err) {
                jobResult.error.push({
                  task: task,
                  message: err
                })
              }
              else {
                jobResult.processed.push(task)
              }
              return done()
            })
          },
        }, itDone)
      }, err => {
        if (err) {
          job.log(err)
          acapi.log.error('%s | %s | # %s | Processing failed %j', functionName, functionIdentifier, jobId, err)
          return cb(err)
        }
        else acapi.log.info('%s | %s | # %s | Processing completed | %sms', functionName, functionIdentifier, jobId, new Date().getTime() - startTime)
        cb()
      })
    })
  },

  logProgress: (job, percent, options) => {
    const jobData = _.get(job, 'data')
    const statusText = _.get(options, 'statusText')
    const controller = _.get(options, 'controller')
    const action = _.get(options, 'action')
    const functionIdentifier = _.padEnd('logProgress', _.get(acapi.config, 'log.padLengthFunctionIdentifier'))
    const jobId = _.get(job, 'id')

    if (controller && action) {
      acapi.log.debug('%s | %s | # %s | %s.%s | %s | %s', functionName, functionIdentifier, jobId, controller, _.padEnd(action, 30), _.padEnd((statusText || ''), 30), percent.toFixed(2))
    }

    job.progress(percent)
    if (statusText) {
      _.set(jobData, 'statusText', statusText)
      job.update(jobData)
    }
  },

  handleFailedJobs: (jobList, jobId) => {
    const functionIdentifier = _.padEnd(jobList, _.get(acapi.config, 'bull.log.functionIdentifierLength'))
    const transcodingJobLists = _.map(_.get(acapi.config, 'transcoding.jobLists'), 'name')

    const jobListName = _.last(_.split(jobList, '.'))
    const { queueName } = acapi.bull.prepareQueue({ jobList: jobListName, configPath: _.indexOf(transcodingJobLists, jobListName) > -1 ? 'transcoding' : 'bull' })
    if (!queueName) return

    const redisKey = acapi.config.environment + ':bull:' + _.get(jobList, 'jobList') + ':' + jobId + ':complete:lock'

    redisLock.lockKey({ redisKey }, err => {
      if (err === 423) {
        acapi.log.debug('%s | %s | %s | # %s | Already processing', functionName, functionIdentifier, queueName, jobId)
      }
      else if (err) {
        acapi.log.error('%s | %s | %s | # %s | Failed %j', functionName, functionIdentifier, queueName, jobId, err)
      }
    })
  }
}

module.exports = BullHelper