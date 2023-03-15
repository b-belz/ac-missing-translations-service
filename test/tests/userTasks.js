const _ = require('lodash')

module.exports = () => {

  let newTask
  let newTask2

  /*
  const multi = () => {
    const tasksToCreate = [
      {
        mcId: 123,
        type: 'taggedInComment',
        userId: 2,
        commentId: 217
      },
      {
        type: 'taggedInTicket',
        userId: 2,
        ticketId: 10
      },
      {
        type: 'taggedInTicketComment',
        userId: 2,
        ticketId: 5
      },
      {
        type: 'assignedTicket',
        userId: 2,
        ticketId: 3
      }
    ]

    const expectedTasks = [{
      id: 1, flag: 0, userId: 2, customerId: 147,
      task: {
        mcId: 123,
        type: 'taggedInComment',
        byUser: 1,
        commentId: 217
      },
    },
    {
      id: 2, flag: 0, userId: 2, customerId: 147,
      task: {
        byUser: 1,
        ticketId: 10,
        type: 'taggedInTicket',
      },
    },
    {
      id: 3, flag: 0, userId: 2, customerId: 147,
      task: {
        byUser: 1,
        ticketId: 5,
        type: 'taggedInTicketComment',
      }
    },
    {
      id: 4, flag: 0, userId: 2, customerId: 147,
      task: {
        byUser: 1,
        ticketId: 3,
        type: 'assignedTicket',
      }
    }]
    let createdTasks = []
    it('create 4 userTasks with user 1 for user 2', (done) => {
      console.log(65, tasksToCreate)
      config.callAPI({
        path: '/v1/userTask/batchCreate',
        method: 'post',
        data: {
          tasks: tasksToCreate
        }
      }, (err, res) => {
        if (err) return done(err)

        createdTasks = res.body.body
        createdTasks.should.be.an('array').that.has.lengthOf(4)
        const tasksWithoutTimestamps = _.map(createdTasks, task => _.omit(task, ['createdAt', 'updatedAt']))
        tasksWithoutTimestamps.should.include.deep.members(expectedTasks)
        return done()
      })
    })

    it('get userTasks for user 1 - should be empty', (done) => {
      config.callAPI({
        path: '/v1/userTask',
      }, (err, res) => {
        if (err) return done(err)

        res.body.should.be.an('array').that.has.lengthOf(0)
        return done()
      })
    })

    it('get userTasks for user 2 - should have 4 tasks', (done) => {
      config.callAPI2({
        path: '/v1/userTask'
      }, (err, res) => {
        if (err) return done(err)

        createdTasks = res.body
        res.body.should.be.an('array').that.has.lengthOf(4)
        const tasksWithoutTimestamps = _.map(res.body, task => _.omit(task, ['createdAt', 'updatedAt']))
        tasksWithoutTimestamps.should.include.deep.members(expectedTasks)

        return done()
      })
    })

    it('update 4 userTasks as "seen"', (done) => {
      config.callAPI2({
        path: '/v1/seenUserTasks',
        method: 'put',
        data: {
          ids: _.map(createdTasks, 'id')
        }
      }, (err, res) => {
        if (err) return done(err)

        res.body.should.deep.equal({})
        _.forEach(expectedTasks, (task => _.set(task, 'flag', 1)))
        return done()
      })
    })

    it('get userTasks for user 2 - should have 4 tasks marked as "seen"', (done) => {
      config.callAPI2({
        path: '/v1/userTask',
      }, (err, res) => {
        if (err) return done(err)

        res.body.should.be.an('array').that.has.lengthOf(4)
        const tasksWithoutTimestamps = _.map(res.body, task => _.omit(task, ['createdAt', 'updatedAt']))
        tasksWithoutTimestamps.should.include.deep.members(expectedTasks)

        return done()
      })
    })

    it('delete userTasks for user 2', (done) => {
      console.log(138, _.map(createdTasks, 'id'))
      config.callAPI2({
        path: '/v1/userTask',
        method: 'delete',
        data: {
          ids: _.map(createdTasks, 'id')
        }
      }, (err, res) => {
        if (err) return done(err)

        res.body.should.deep.equal({})
        _.forEach(expectedTasks, (task => _.set(task, 'flag', 2)))
        return done()
      })
    })

    it('get userTasks including deleted for user 2 - should have 4 tasks marked as "deleted"', (done) => {
      config.callAPI2({
        path: '/v1/userTask',
        data: { includeDeleted: true },
      }, (err, res) => {
        if (err) return done(err)

        res.body.should.be.an('array').that.has.lengthOf(4)
        const tasksWithoutTimestamps = _.map(res.body, task => _.omit(task, ['createdAt', 'updatedAt']))
        tasksWithoutTimestamps.should.include.deep.members(expectedTasks)

        return done()
      })
    })

    it('get userTasks without deleted for user 2 - should have 0 tasks', (done) => {
      config.callAPI2({
        path: '/v1/userTask',
      }, (err, res) => {
        if (err) return done(err)

        res.body.should.be.an('array').that.has.lengthOf(0)
        return done()
      })
    })
  }
  */

  const basics = () => {
    describe('Test a typical cycle', () => {
      it('Create a new task', (done) => {
        let data = {
          type: 'receivedOwnership',
          userId: 2,
          task: {
            ids: [1],
            model: 'mediacontainer'
          }

        }
        config.callAPI({
          path: '/v1/userTask',
          method: 'post',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'id', value: data.id },
            { field: 'type', value: data.type },
            { field: 'ids', value: data.task.ids, path: 'task' }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body.body })
          newTask = res.body.body
          return done()
        })
      })

      it('Read tasks as creator - should be empty', (done) => {
        config.callAPI({
          path: '/v1/userTask'
        }, (err, res) => {
          if (err) return done(err)
          let expectedProperties = [
            { field: 'body', value: [] }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Read tasks as receiver - should contain the task', (done) => {
        config.callAPI2({
          path: '/v1/userTask'
        }, (err, res) => {
          if (err) return done(err)
          let expectedProperties = [
            { field: 'body', length: 1 },
            { field: 'id', value: newTask.id, path: 'body[0]' },
            { field: 'type', value: newTask.type, path: 'body[0]' },
            { field: 'ids', value: newTask.task.ids, path: 'body[0].task' },
            { field: 'creatorId', value: 1, path: 'body[0]' },
            { field: 'flag', value: 0, path: 'body[0]' },

          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Creator tries to mark task as read - should fail', (done) => {
        let data = {
          ids: [newTask.id],
          flag: 1
        }
        config.callAPI({
          path: '/v1/userTask',
          method: 'put',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'body', value: {} },
            { field: 'message', value: 'idInvalid', path: 'warnings[0]' },
            { field: 'id', value: newTask.id, path: 'warnings[0]' },
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Receiver tries to mark task as read with the wrong flag - should fail', (done) => {
        let data = {
          ids: [newTask.id],
          flag: 22
        }
        config.callAPI2({
          path: '/v1/userTask',
          method: 'put',
          data,
          expectedStatus: 400
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'message', value: 'error_usertask_update_flag_notAnAllowedValue' }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Receiver tries to mark task as read - should work', (done) => {
        let data = {
          ids: [newTask.id],
          flag: 1
        }
        config.callAPI2({
          path: '/v1/userTask',
          method: 'put',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'ids', value: data.ids }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body.body })
          return done()
        })
      })

      it('Read tasks as receiver - task is already read - flag should be 1', (done) => {
        config.callAPI2({
          path: '/v1/userTask'
        }, (err, res) => {
          if (err) return done(err)
          let expectedProperties = [
            { field: 'body', length: 1 },
            { field: 'id', value: newTask.id, path: 'body[0]' },
            { field: 'type', value: newTask.type, path: 'body[0]' },
            { field: 'ids', value: newTask.task.ids, path: 'body[0].task' },
            { field: 'creatorId', value: 1, path: 'body[0]' },
            { field: 'flag', value: 1, path: 'body[0]' },
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Receiver deletes the task - should work', (done) => {
        let data = {
          ids: [newTask.id]
        }
        config.callAPI2({
          path: '/v1/userTask',
          method: 'delete',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'ids', value: data.ids }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body.body })
          return done()
        })
      })

      it('Read tasks as receiver - should not be returned', (done) => {
        config.callAPI2({
          path: '/v1/userTask'
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'body', length: 0 }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Read tasks as receiver query flag 99', (done) => {
        config.callAPI2({
          path: '/v1/userTask',
          data: {
            flags: [99]
          }
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'body', length: 1 },
            { field: 'id', value: newTask.id, path: 'body[0]' },
            { field: 'type', value: newTask.type, path: 'body[0]' },
            { field: 'ids', value: newTask.task.ids, path: 'body[0].task' },
            { field: 'creatorId', value: 1, path: 'body[0]' },
            { field: 'flag', value: 99, path: 'body[0]' },
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Receiver tries to mark the task as read again - should fail', (done) => {
        let data = {
          ids: [newTask.id],
          flag: 1
        }
        config.callAPI2({
          path: '/v1/userTask',
          method: 'put',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'body', value: {} },
            { field: 'message', value: 'alreadyDeleted', path: 'warnings[0]' },
            { field: 'id', value: newTask.id, path: 'warnings[0]' },
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

      it('Receiver tries to delete the task again - should fail', (done) => {
        let data = {
          ids: [newTask.id]
        }
        config.callAPI2({
          path: '/v1/userTask',
          method: 'delete',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'body', value: {} },
            { field: 'message', value: 'alreadyDeleted', path: 'warnings[0]' },
            { field: 'id', value: newTask.id, path: 'warnings[0]' },
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })

    })
  }

  const commentBased = () => {
    describe('Test with comments', () => {
      it('Create a new task #1 for comments', (done) => {
        let data = {
          type: 'taggedInComment',
          userId: 2,
          task: {
            ids: [1],
            model: 'comment'
          }

        }
        config.callAPI({
          path: '/v1/userTask',
          method: 'post',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'id', value: data.id },
            { field: 'type', value: data.type },
            { field: 'ids', value: data.task.ids, path: 'task' }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body.body })
          newTask = res.body.body
          return done()
        })
      })

      it('Create a new task #2 for comments', (done) => {
        let data = {
          type: 'taggedInComment',
          userId: 2,
          task: {
            ids: [1],
            model: 'comment'
          }

        }
        config.callAPI({
          path: '/v1/userTask',
          method: 'post',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'id', value: data.id },
            { field: 'type', value: data.type },
            { field: 'ids', value: data.task.ids, path: 'task' }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body.body })
          newTask2 = res.body.body
          return done()
        })
      })

      it('Read tasks as receiver - should contain the tasks', (done) => {
        config.callAPI2({
          path: '/v1/userTask'
        }, (err, res) => {
          if (err) return done(err)
          let expectedProperties = [
            { field: 'body', length: 2 },
            { field: 'id', value: newTask.id, path: 'body[0]' },
            { field: 'type', value: newTask.type, path: 'body[0]' },
            { field: 'ids', value: newTask.task.ids, path: 'body[0].task' },
            { field: 'creatorId', value: 1, path: 'body[0]' },
            { field: 'flag', value: 0, path: 'body[0]' },

          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })


      it('Receiver deletes the task by comment - should work', (done) => {
        let data = {
          commentId: 1
        }
        config.callAPI2({
          path: '/v1/userTask',
          method: 'delete',
          data,
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'ids', type: 'array', value: [newTask.id, newTask2.id] },
            { field: 'commentId', value: data.commentId }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body.body })
          return done()
        })
      })

      it('Read tasks as receiver - should not be returned', (done) => {
        config.callAPI2({
          path: '/v1/userTask'
        }, (err, res) => {
          if (err) return done(err)

          let expectedProperties = [
            { field: 'body', length: 0 }
          ]
          helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
          return done()
        })
      })


    })
  }

  let tests = [
    { title: 'BASICS', fn: basics },
    { title: 'COMMENT BASED', fn: commentBased },
    // { title: 'Multiple tasks', fn: multi },
  ]

  _.forEach(tests, test => {
    describe(test.title, test.fn)
  })
}
