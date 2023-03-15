const defaultDef = {
  descriptions: [
    { action: 'create', description: 'Creates one or more new UserTask.' },
    { action: 'read', description: 'Returns all userTasks for the requesting user.' },
    { action: 'update', description: 'Marks userTasks as seen.' },
    { action: 'delete', description: 'Marks userTasks as deleted.' },
  ],
  fields: [
    {
      actions: ['response'],
      field: 'id',
      type: 'integer',
      description: 'Id of the task',
    },
    {
      actions: ['response'],
      field: 'createdAt',
      type: 'string',
      description: 'created timestamp',
    },
    {
      actions: ['response'],
      field: 'updatedAt',
      type: 'string',
      description: 'updated timestamp',
    },
    {
      actions: ['read'],
      field: 'since',
      type: 'date',
      description: 'get tasks created since specified date',
    },
    {
      actions: ['read'],
      field: 'until',
      type: 'date',
      description: 'get tasks created until specified date',
    },
    {
      actions: ['read'],
      field: 'flags',
      type: 'array',
      description: 'Flags of tasks to return. Defaults to [0,1]',
    },
    {
      actions: ['response'],
      field: 'creatorId',
      type: 'integer',
      description: 'Id of the creator of the task',
    },
    {
      actions: ['response'],
      field: 'readTimestamp',
      type: 'integer',
      description: 'Unix Timestamp when the task was marked read (set to flag 1).',
      },
    {
      actions: ['update', 'response'],
      field: 'flag',
      type: 'integer',
      enum: [0,1,99],
      requiredFor: [{
        action: 'update'
      }],
      description: [{
        action: 'update',
        message: 'Set the flag of the task (usually mark it read with flag 1).'
      },{
        action: 'response',
        message: 'Flag of the task.'
      }]
    },
    {
      actions: ['create', 'response'],
      field: 'type',
      type: 'string',
      description: [{
        action: 'create',
        message: 'Type of the task.'
      },{
        action: 'response', 
        message: 'the action that led to the creation of the task'
      }],
      enum: ['taggedInComment', 'receivedOwnership'],
      required: true
    },
    {
      actions: ['create', 'response'],
      field: 'task',
      type: 'object',
      description: [{
        action: 'create',
        message: 'Task to create'
      },{
        action: 'response', 
        message: 'The actual task'
      }],
      required: true,
      properties: [
        {
          field: 'ids',
          type: 'array',
          description: 'Model ids for the task',
          required: true
        },
        {
          field: 'model',
          type: 'string',
          enum: ['mediacontainer', 'comment'],
          defaultsTo: 'mediacontainer',
          required: true,
          description: 'Model the ids are based on, defaults to mediacontainer'
        }
      ]
    },
    {
      actions: ['create', 'response'],
      field: 'userId',
      type: 'integer',
      description: 'userId of the user that this task is assigned to',
      required: true
    },
    {
      actions: ['update', 'delete', 'response.update', 'response.delete'],
      field: 'ids',
      type: 'array',
      valueType: 'integer',
      minSize: 1,
      description: [{
        action: 'update',
        message: 'Array of ids of the tasks you want to update'
      },{
        action: 'update',
        message: 'Array of ids of the tasks you want to mark as deleted'
      }, {
        action: 'response.update', 
        message: 'Ids that have been updated. See warnings object for ignored ids'
      }, {
        action: 'response.delete', 
        message: 'Ids that have been marked deleted. See warnings object for ignored ids'
      }],
      requiredFor: [
        { action: 'update' },
        { action: 'delete', condition: { field: 'commentId', op: 'not' } }, 
      ],
    },
    {
      actions: ['delete', 'response.delete'],
      field: 'commentId',
      type: 'integer',
      description: [{
        action: 'delete',
        message: 'Marks all userTasks for a comment as deleted'
      },{
        action: 'response.delete', 
        message: 'All tasks for the commentId have been marked deleted'
      }],
      requiredFor: [
        { action: 'delete', condition: { field: 'ids', op: 'not' } }, 
        { action: 'response.delete' }
      ]
    },
    {
      actions: ['batchcreate'],
      field: 'tasks',
      type: 'array',
      valueType: 'object',
      required: true,
      description: 'Array of tasks',
      properties: [
        {
          field: 'type',
          type: 'string',
          description: 'Type of the task',
          enum: ['taggedInComment', 'taggedInTicket', 'taggedInTicketComment', 'assignedTicket', 'receivedOwnership'],
          required: true
        },
        {
          field: 'task',
          type: 'object',
          description: 'Task to create',
          required: true,
          properties: [
            {
              field: 'ids',
              type: 'array',
              description: 'Model ids for the task',
              required: true
            },
            {
              field: 'model',
              type: 'string',
              enum: ['mediacontainer', 'comment'],
              required: true,
              description: 'Model the ids are based on, defaults to mediacontainer'
            }
          ]
        },
        {
          field: 'userId',
          type: 'integer',
          description: 'userId of the user that this task is assigned to',
          required: true
        },
      ]
    }
  ]
}

module.exports.apiDoc = {
  usertask: defaultDef,
}